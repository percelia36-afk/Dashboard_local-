

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db";

export async function GET(req) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  // Get Clerk user ID from session
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Use YOUTUBE_CLIENT_ID if set, otherwise fallback to GOOGLE_CLIENT_ID
  const clientId =
    process.env.YOUTUBE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const clientSecret =
    process.env.YOUTUBE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: "http://localhost:3000/api/oauth/youtube",
  });

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return NextResponse.json(
      { error: "Token exchange failed" },
      { status: 400 },
    );
  }

  // Store token data in the linked_accounts table
  try {
    await db.query(
      `INSERT INTO linked_accounts (clerk_user_id, provider, provider_user_id, access_token, refresh_token, expires_at)
       VALUES ($1, $2, $3, $4, $5, to_timestamp($6))
       ON CONFLICT (clerk_user_id, provider) DO UPDATE SET
         access_token = EXCLUDED.access_token,
         refresh_token = EXCLUDED.refresh_token,
         expires_at = EXCLUDED.expires_at` ,
      [
        userId,
        "youtube",
        tokenData.id_token || null,
        tokenData.access_token,
        tokenData.refresh_token || null,
        tokenData.expires_in ? (Date.now() / 1000) + tokenData.expires_in : null,
      ]
    );
  } catch (err) {
    return NextResponse.json({ error: "DB error", details: err.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, linked: true });
}

  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  // Get Clerk user ID from session
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Use YOUTUBE_CLIENT_ID if set, otherwise fallback to GOOGLE_CLIENT_ID
  const clientId =
    process.env.YOUTUBE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const clientSecret =
    process.env.YOUTUBE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: "http://localhost:3000/api/oauth/youtube",
  });

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return NextResponse.json(
      { error: "Token exchange failed" },
      { status: 400 },
    );
  }

  // Store token data in the linked_accounts table
  try {
    await db.query(
      `INSERT INTO linked_accounts (clerk_user_id, provider, provider_user_id, access_token, refresh_token, expires_at)
       VALUES ($1, $2, $3, $4, $5, to_timestamp($6))
       ON CONFLICT (clerk_user_id, provider) DO UPDATE SET
         access_token = EXCLUDED.access_token,
         refresh_token = EXCLUDED.refresh_token,
         expires_at = EXCLUDED.expires_at` ,
      [
        userId,
        "youtube",
        tokenData.id_token || null,
        tokenData.access_token,
        tokenData.refresh_token || null,
        tokenData.expires_in ? (Date.now() / 1000) + tokenData.expires_in : null,
      ]
    );
  } catch (err) {
    return NextResponse.json({ error: "DB error", details: err.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, linked: true });
}
}
}
