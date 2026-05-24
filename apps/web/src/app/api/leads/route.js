import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const leads =
      await sql`SELECT * FROM leads WHERE user_id = ${userId} ORDER BY created_at DESC`;
    return Response.json(leads);
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
    const { name, email, phone, status, notes } = await request.json();

    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO leads (user_id, name, email, phone, status, notes)
      VALUES (${userId}, ${name}, ${email}, ${phone}, ${status || "new"}, ${notes})
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
