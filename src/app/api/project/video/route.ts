import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Project } from "@/models/Project";
import { getAuth } from "@/lib/auth";
import { uploadVideo } from "@/lib/cloudinary";
import { generateVideoFromImage } from "@/lib/genai";

const CREDITS_VIDEO = 10;

export async function POST(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { projectId } = body;
    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }
    await connectDb();
    const user = await User.findById(auth.userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const project = await Project.findOne({
      _id: projectId,
      userId: auth.userId,
    });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    const imageUrl = project.generatedImage || project.uploadedImages?.[0];
    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image available for video generation" },
        { status: 400 }
      );
    }
    if (project.generatedVideo) {
      return NextResponse.json({
        project: {
          ...project.toObject(),
          _id: project._id.toString(),
          id: project._id.toString(),
        },
        message: "Video already generated",
      });
    }
    if (project.isVideoGenerating) {
      return NextResponse.json({
        project: {
          ...project.toObject(),
          _id: project._id.toString(),
          id: project._id.toString(),
        },
        message: "Video generation already in progress",
      });
    }
    if (user.credits < CREDITS_VIDEO) {
      return NextResponse.json(
        { error: "Insufficient credits. Need 10 for video generation." },
        { status: 400 }
      );
    }
    user.credits -= CREDITS_VIDEO;
    await user.save();

    project.isVideoGenerating = true;
    project.videoGenerationStartedAt = new Date();
    await project.save();

    let videoUrl = "";
    try {
      const videoBuffer = await generateVideoFromImage(
        imageUrl,
        project.productName,
        project.userPrompt ?? ""
      );
      videoUrl = await uploadVideo(videoBuffer, "adsgen/videos");
    } catch (err) {
      console.error(err);
      user.credits += CREDITS_VIDEO;
      await user.save();
      project.isVideoGenerating = false;
      project.videoGenerationStartedAt = null;
      await project.save();
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Video generation failed" },
        { status: 500 }
      );
    }
    project.generatedVideo = videoUrl;
    project.isVideoGenerating = false;
    project.videoGenerationStartedAt = null;
    await project.save();
    return NextResponse.json({
      project: {
        ...project.toObject(),
        generatedVideo: videoUrl,
        _id: project._id.toString(),
        id: project._id.toString(),
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Video generation failed" }, { status: 500 });
  }
}
