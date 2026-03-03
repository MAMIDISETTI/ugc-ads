import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongoose";
import { Project } from "@/models/Project";
import { getAuth } from "@/lib/auth";

export async function DELETE(
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
    });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    await Project.deleteOne({ _id: projectId, userId: auth.userId });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
