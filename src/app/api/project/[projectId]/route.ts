import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongoose";
import { Project } from "@/models/Project";
import { getAuth } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const auth = getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { projectId } = await params;
  try {
    const body = await req.json();
    const { userPrompt, regenerate } = body as { userPrompt?: string; regenerate?: boolean };
    await connectDb();
    const project = await Project.findOne({
      _id: projectId,
      userId: auth.userId,
    });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (typeof userPrompt === "string") project.userPrompt = userPrompt;
    if (regenerate) {
      project.generatedImage = "";
      project.isGenerating = true;
      (project as { generationStartedAt?: Date | null }).generationStartedAt = null;
    }
    await project.save();
    return NextResponse.json({
      project: {
        ...project.toObject(),
        _id: project._id.toString(),
        id: project._id.toString(),
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

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
