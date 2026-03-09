import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
if (!apiKey) {
  console.warn("GOOGLE_CLOUD_API_KEY not set – AI features will fail.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function generateImagePrompt(
  productName: string,
  productDescription: string,
  userPromptPartial: string
): Promise<string[]> {
  if (!ai) return [];
  const prompt = `You are an ad copy expert.

Product Name: ${productName}
Product Description: ${productDescription}

User's Partial Prompt: "${userPromptPartial}"

Based on the user's partial prompt, generate exactly 10 short ad creative prompt suggestions that logically complete the idea.

Rules:
- Each suggestion must be one short line.
- Suggestions must be relevant to the product and the user's partial prompt.
- Do not add numbering, bullets, or extra text.
- Return exactly 10 lines only.
`;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  const text = (response.text ?? "").trim();
  return text
    .split("\n")
    .map((s) => s.replace(/^[\d.)\-\*]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 10);
}

export async function generateAdImage(
  productImageUrl: string,
  productName: string,
  productDescription: string,
  userPrompt: string,
  _aspectRatio: string
): Promise<Buffer> {
  if (!ai) throw new Error("Google GenAI not configured");
  const imageBase64 = await fetchImageAsBase64(productImageUrl);
  const prompt = `Create a single high-quality UGC-style ad image for social media (Meta/Instagram/Reels). 
Product: ${productName}. Description: ${productDescription}.
User creative direction: ${userPrompt || "Modern, eye-catching UGC ad."}
Output a single image, no text overlay unless requested.`;
  const response = await ai.interactions.create({
    model: "gemini-3-pro-image-preview",
    input: [
      { type: "text", text: prompt },
      { type: "image", data: imageBase64, mime_type: "image/jpeg" },
    ],
    response_modalities: ["image"],
  });
  for (const output of response.outputs ?? []) {
    if (output.type === "image" && output.data) {
      return Buffer.from(output.data, "base64");
    }
  }
  throw new Error("No image in response");
}

async function fetchImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  return buf.toString("base64");
}

/** Poll interval for Veo long-running operation (ms). */
const VEO_POLL_INTERVAL_MS = 10_000;
/** Max time to wait for video generation (ms). */
const VEO_TIMEOUT_MS = 300_000;

export async function generateVideoFromImage(
  imageUrl: string,
  productName: string,
  userPrompt: string
): Promise<Buffer> {
  if (!ai) throw new Error("Google GenAI not configured");
  const imageBase64 = await fetchImageAsBase64(imageUrl);
  const prompt = `Short 5-second UGC ad video for: ${productName}. ${userPrompt || "Engaging, dynamic."}`;
  try {
    let operation = await ai.models.generateVideos({
      model: "veo-3.1-generate-preview",
      prompt,
      image: { imageBytes: imageBase64, mimeType: "image/jpeg" },
      config: { numberOfVideos: 1 },
    });
    const deadline = Date.now() + VEO_TIMEOUT_MS;
    while (!operation.done && Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, VEO_POLL_INTERVAL_MS));
      operation = await ai.operations.getVideosOperation({ operation });
    }
    if (!operation.done) {
      throw new Error("Video generation timed out.");
    }
    if (operation.error) {
      const err = operation.error as { message?: string };
      throw new Error(err?.message ?? JSON.stringify(operation.error));
    }
    const video = operation.response?.generatedVideos?.[0]?.video;
    if (!video) {
      throw new Error("No video in response.");
    }
    if (video.videoBytes) {
      return Buffer.from(video.videoBytes, "base64");
    }
    if (video.uri) {
      const tmpPath = path.join(os.tmpdir(), `veo-${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`);
      const generatedVideo = operation.response!.generatedVideos![0]!;
      await ai.files.download({
        file: generatedVideo,
        downloadPath: tmpPath,
      });
      try {
        return fs.readFileSync(tmpPath);
      } finally {
        try {
          fs.unlinkSync(tmpPath);
        } catch {
          // ignore cleanup errors
        }
      }
    }
    throw new Error("Video response has no videoBytes or uri.");
  } catch (e) {
    console.warn("Video generation failed (Veo may not be enabled):", e);
    throw new Error("Video generation not available. Ensure Veo model is enabled.");
  }
}
