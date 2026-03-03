import { NextResponse } from "next/server";
import { generateImagePrompt } from "@/lib/genai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { partialPrompt, productName, productDescription } = body;
    if (!productName) {
      return NextResponse.json(
        { error: "productName is required" },
        { status: 400 }
      );
    }
    const suggestions = await generateImagePrompt(
      productName,
      productDescription ?? "",
      partialPrompt ?? ""
    );
    return NextResponse.json({ suggestions });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to get suggestions" }, { status: 500 });
  }
}
