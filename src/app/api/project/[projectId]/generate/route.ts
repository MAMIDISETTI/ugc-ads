import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Project } from "@/models/Project";
import { getAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { generateAdImage } from "@/lib/genai";

const CREDITS_IMAGE = 5;
const GENERATION_LOCK_MS = 8 * 60 * 1000;

export async function POST(
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
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (project.generatedImage) {
      return NextResponse.json({
        project: toProjectJson(project),
      });
    }
    const now = Date.now();
    const startedAt = project.generationStartedAt
      ? new Date(project.generationStartedAt).getTime()
      : 0;
    if (project.generationStartedAt && now - startedAt < GENERATION_LOCK_MS) {
      return NextResponse.json({
        project: toProjectJson(project),
        message: "Generation already in progress",
      });
    }
    project.generationStartedAt = new Date();
    await project.save();

    const [uploadedUrl] = project.uploadedImages;
    if (!uploadedUrl) {
      project.isGenerating = false;
      project.error = "No uploaded image";
      (project as { generationStartedAt?: Date | null }).generationStartedAt = null;
      await project.save();
      return NextResponse.json({ error: project.error }, { status: 400 });
    }

    try {
      const imageBuffer = await generateAdImage(
        uploadedUrl,
        project.productName,
        project.productDescription ?? "",
        project.userPrompt ?? "",
        project.aspectRatio ?? "9:16"
      );
      const generatedImageUrl = await uploadImage(imageBuffer, "adsgen/generated");
      project.generatedImage = generatedImageUrl;
      project.isGenerating = false;
      project.error = "";
      (project as { generationStartedAt?: Date | null }).generationStartedAt = null;
      await project.save();
      return NextResponse.json({
        project: toProjectJson(project),
      });
    } catch (err) {
      console.error(err);
      const user = await User.findById(auth.userId);
      if (user) {
        user.credits += CREDITS_IMAGE;
        await user.save();
      }
      project.isGenerating = false;
      project.error = err instanceof Error ? err.message : "Image generation failed";
      (project as { generationStartedAt?: Date | null }).generationStartedAt = null;
      await project.save();
      return NextResponse.json(
        { error: project.error },
        { status: 500 }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function toProjectJson(project: InstanceType<typeof Project>) {
  const obj = project.toObject ? project.toObject() : project;
  return {
    ...obj,
    _id: (obj as { _id?: unknown })._id?.toString?.() ?? project._id?.toString?.(),
    id: (obj as { _id?: unknown })._id?.toString?.() ?? project._id?.toString?.(),
  };
}
