import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD || "UrbanoAdmin2026";

    if (password === adminPassword) {
      return Response.json({ success: true, token: "admin-auth-secure-session-2026" });
    }

    return Response.json({ error: "Invalid password" }, { status: 401 });
  } catch (err: any) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
