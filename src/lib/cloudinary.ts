import { v2 as cloudinary } from "cloudinary";

const url = process.env.CLOUDINARY_URL;
if (url) {
  const parsed = new URL(url.replace(/^cloudinary:\/\//, "https://"));
  const apiKey = parsed.username || "";
  const apiSecret = parsed.password || "";
  const cloudName = parsed.hostname || "";
  if (apiKey && apiSecret && cloudName) {
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  }
}

export async function uploadImage(buffer: Buffer, folder = "adsgen"): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder, resource_type: "image" },
        (err, result) => {
          if (err) return reject(err);
          if (!result?.secure_url) return reject(new Error("No URL returned"));
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}

export async function uploadVideo(buffer: Buffer, folder = "adsgen"): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder, resource_type: "video" },
        (err, result) => {
          if (err) return reject(err);
          if (!result?.secure_url) return reject(new Error("No URL returned"));
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}

export { cloudinary };
