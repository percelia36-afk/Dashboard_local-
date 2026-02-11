import { NextResponse } from "next/server";
import db from "@/db";

export async function POST(req) {
  const body = await req.json();
  if (body.type === "user.created") {
    const user = body.data;
    try {
      await db.query(
        `INSERT INTO users (clerk_user_id, username, email)
         VALUES ($1, $2, $3)
         ON CONFLICT (clerk_user_id) DO UPDATE SET
           username = EXCLUDED.username,
           email = EXCLUDED.email`,
        [
          user.id,
          user.username || user.first_name || null,
          user.email_addresses?.[0]?.email_address || null,
        ],
      );
    } catch (err) {
      return NextResponse.json(
        { error: "DB error", details: err.message },
        { status: 500 },
      );
    }
  }
  return NextResponse.json({ success: true });
}
