import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const rows =
      await sql`SELECT id, name, email, image, business_name, phone_number FROM auth_users WHERE id = ${userId} LIMIT 1`;
    const user = rows?.[0] || null;
    return Response.json({ user });
  } catch (err) {
    console.error("GET /api/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { business_name, phone_number, name } = body || {};

    const setClauses = [];
    const values = [];

    if (business_name !== undefined) {
      setClauses.push(`business_name = $${values.length + 1}`);
      values.push(business_name);
    }
    if (phone_number !== undefined) {
      setClauses.push(`phone_number = $${values.length + 1}`);
      values.push(phone_number);
    }
    if (name !== undefined) {
      setClauses.push(`name = $${values.length + 1}`);
      values.push(name);
    }

    if (setClauses.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    const query = `UPDATE auth_users SET ${setClauses.join(", ")} WHERE id = $${values.length + 1} RETURNING id, name, email, image, business_name, phone_number`;
    const result = await sql(query, [...values, userId]);

    return Response.json({ user: result?.[0] || null });
  } catch (err) {
    console.error("PUT /api/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
