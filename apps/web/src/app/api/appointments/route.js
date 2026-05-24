import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const appointments = await sql`
      SELECT a.*, l.name as lead_name 
      FROM appointments a
      LEFT JOIN leads l ON a.lead_id = l.id
      WHERE a.user_id = ${userId}
      ORDER BY scheduled_at ASC
    `;
    return Response.json(appointments);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { lead_id, title, description, scheduled_at, duration_minutes } =
      await request.json();

    if (!title || !scheduled_at) {
      return Response.json(
        { error: "Title and scheduled_at are required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO appointments (user_id, lead_id, title, description, scheduled_at, duration_minutes)
      VALUES (${userId}, ${lead_id}, ${title}, ${description}, ${scheduled_at}, ${duration_minutes || 60})
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
