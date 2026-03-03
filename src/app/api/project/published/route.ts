import { NextResponse } from "next/server";
import { connectDb } from "@/lib/mongoose";
import { Project } from "@/models/Project";

export async function GET() {
  try {
    await connectDb();
    const projects = await Project.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(50)
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
