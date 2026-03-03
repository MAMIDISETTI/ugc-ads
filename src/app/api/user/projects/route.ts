import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongoose";
import { Project } from "@/models/Project";
import { getAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDb();
    const projects = await Project.find({ userId: auth.userId })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(
      projects.map((p) => ({
        ...p,
        _id: (p as { _id: unknown })._id?.toString?.(),
        id: (p as { _id: unknown })._id?.toString?.(),
      }))
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
