import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongoose";
import { Project } from "@/models/Project";
import { getAuth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const auth = getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { projectId } = await params;
  try {
    await connectDb();
    const project = await Project.findOne({
      _id: projectId,
      userId: auth.userId,
    }).lean();
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json({
      ...project,
      _id: (project as { _id: unknown })._id?.toString?.(),
      id: (project as { _id: unknown })._id?.toString?.(),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
