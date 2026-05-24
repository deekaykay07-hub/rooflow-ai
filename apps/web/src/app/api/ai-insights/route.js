import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get recent leads and appointments to provide context to AI
    const [leads, appointments] = await sql.transaction([
      sql`SELECT name, status, created_at FROM leads WHERE user_id = ${userId} LIMIT 10`,
      sql`SELECT title, scheduled_at FROM appointments WHERE user_id = ${userId} LIMIT 10`,
    ]);

    const prompt = `
      As an AI assistant for a roofing business dashboard, analyze the following data and provide 3 actionable business insights.
      
      Recent Leads:
      ${leads.map((l) => `- ${l.name} (${l.status})`).join("\n")}
      
      Upcoming Appointments:
      ${appointments.map((a) => `- ${a.title} at ${a.scheduled_at}`).join("\n")}
      
      Provide your response in JSON format with an array called "insights", where each object has a "title" and a "description".
    `;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CREATE_APP_URL}/integrations/chat-gpt/conversationgpt4`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          json_schema: {
            name: "business_insights",
            schema: {
              type: "object",
              properties: {
                insights: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                    },
                    required: ["title", "description"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["insights"],
              additionalProperties: false,
            },
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error("AI integration failed");
    }

    const data = await response.json();
    const insights = JSON.parse(data.choices[0].message.content).insights;

    return Response.json({ insights });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
