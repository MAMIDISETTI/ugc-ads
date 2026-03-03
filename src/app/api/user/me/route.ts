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
    const user = await User.findById(auth.userId).select("-password");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      image: user.image,
      credits: user.credits,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
