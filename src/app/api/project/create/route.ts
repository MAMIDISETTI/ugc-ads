import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Project } from "@/models/Project";
import { getAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

const CREDITS_IMAGE = 5;
const CREDITS_VIDEO = 10;

export async function POST(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const productName = formData.get("productName") as string;
    const productDescription = (formData.get("productDescription") as string) ?? "";
    const userPrompt = (formData.get("userPrompt") as string) ?? "";
    const aspectRatio = (formData.get("aspectRatio") as string) ?? "9:16";
    const imageFiles = formData.getAll("images") as File[];
    const mode = (formData.get("mode") as string) || "image";
    const validFiles = imageFiles.filter((f) => f && f.size > 0);
    if (!name || !productName || validFiles.length === 0) {
      return NextResponse.json(
        { error: "name, productName, and at least one image are required" },
        { status: 400 }
      );
    }
    await connectDb();
    const user = await User.findById(auth.userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const isVideoOnly = mode === "video";
    // Video-only: don't deduct here (video API deducts 10). Image: deduct 5.
    const creditsRequired = isVideoOnly ? 0 : CREDITS_IMAGE;
    const creditsNeeded = isVideoOnly ? CREDITS_VIDEO : CREDITS_IMAGE;
    if (user.credits < creditsNeeded) {
      return NextResponse.json(
        { error: isVideoOnly ? "Insufficient credits. Need 10 for video generation." : "Insufficient credits. Need 5 for image generation." },
        { status: 400 }
      );
    }
    if (creditsRequired > 0) {
      user.credits -= creditsRequired;
      await user.save();
    }
    const uploadedUrls: string[] = [];
    for (const file of validFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const url = await uploadImage(buffer);
      uploadedUrls.push(url);
    }
    const project = await Project.create({
      name,
      userId: auth.userId,
      productName,
      productDescription,
      userPrompt,
      aspectRatio,
      uploadedImages: uploadedUrls,
      isGenerating: !isVideoOnly,
    });
    return NextResponse.json({
      projectId: project._id.toString(),
      project: {
        ...project.toObject(),
        _id: project._id.toString(),
        id: project._id.toString(),
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
