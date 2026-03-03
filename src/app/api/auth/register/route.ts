import { NextResponse } from "next/server";
import { connectDb } from "@/lib/mongoose";
import { User } from "@/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }
    await connectDb();
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }
    const user = await User.create({ email, password, name });
    const token = signToken({ userId: user._id.toString(), email: user.email });
    return NextResponse.json({
      token,
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
        credits: user.credits,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
