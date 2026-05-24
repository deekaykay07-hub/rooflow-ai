import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = params;
    const result =
      await sql`SELECT * FROM leads WHERE id = ${id} AND user_id = ${session.user.id}`;
    if (!result[0])
      return Response.json({ error: "Lead not found" }, { status: 404 });
    return Response.json(result[0]);
  } catch (err) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = params;
    const body = await request.json();

    const setClauses = [];
    const values = [];
    for (const [key, value] of Object.entries(body)) {
      if (["name", "email", "phone", "status", "notes"].includes(key)) {
        setClauses.push(`${key} = $${values.length + 1}`);
        values.push(value);
      }
    }

    if (setClauses.length === 0)
      return Response.json({ error: "No fields to update" }, { status: 400 });

    const query = `UPDATE leads SET ${setClauses.join(", ")} WHERE id = $${values.length + 1} AND user_id = $${values.length + 2} RETURNING *`;
    const result = await sql(query, [...values, id, session.user.id]);

    return Response.json(result[0]);
  } catch (err) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = params;
    await sql`DELETE FROM leads WHERE id = ${id} AND user_id = ${session.user.id}`;
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
