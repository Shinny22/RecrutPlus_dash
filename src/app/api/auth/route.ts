import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username === "admin" && password === "Admin123#") {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ message: "Identifiants invalides" }, { status: 401 });
}
