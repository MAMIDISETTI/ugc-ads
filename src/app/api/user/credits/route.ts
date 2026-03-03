import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongoose";
import { User } from "@/models/User";
import { getAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDb();
    const user = await User.findById(auth.userId).select("credits");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ credits: user.credits });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
