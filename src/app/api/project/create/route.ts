import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Project } from "@/models/Project";
import { getAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

const CREDITS_IMAGE = 5;

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
    const file = formData.get("images") as File | null;
    if (!name || !productName || !file) {
      return NextResponse.json(
        { error: "name, productName, and one image are required" },
        { status: 400 }
      );
    }
    await connectDb();
    const user = await User.findById(auth.userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.credits < CREDITS_IMAGE) {
      return NextResponse.json(
        { error: "Insufficient credits. Need 5 for image generation." },
        { status: 400 }
      );
    }
    user.credits -= CREDITS_IMAGE;
    await user.save();
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadedUrl = await uploadImage(buffer);
    const project = await Project.create({
      name,
      userId: auth.userId,
      productName,
      productDescription,
      userPrompt,
      aspectRatio,
      uploadedImages: [uploadedUrl],
      isGenerating: true,
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
