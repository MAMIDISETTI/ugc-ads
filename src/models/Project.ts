import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productName: { type: String, required: true },
    productDescription: { type: String, default: "" },
    userPrompt: { type: String, default: "" },
    aspectRatio: { type: String, default: "9:16" },
    targetLength: { type: Number, default: 5 },
    uploadedImages: { type: [String], default: [] },
    generatedImage: { type: String, default: "" },
    generatedVideo: { type: String, default: "" },
    isGenerating: { type: Boolean, default: false },
    generationStartedAt: { type: Date, default: null },
    isVideoGenerating: { type: Boolean, default: false },
    videoGenerationStartedAt: { type: Date, default: null },
    isPublished: { type: Boolean, default: false },
    error: { type: String, default: "" },
  },
  { timestamps: true }
);

projectSchema.virtual("id").get(function () {
  return this._id.toString();
});
projectSchema.set("toJSON", { virtuals: true });
projectSchema.set("toObject", { virtuals: true });

export const Project = mongoose.models.Project ?? mongoose.model("Project", projectSchema);
