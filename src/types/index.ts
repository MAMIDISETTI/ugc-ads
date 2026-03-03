export interface User {
  _id: string;
  email: string;
  name: string;
  image?: string;
  credits: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  id?: string;
  name: string;
  userId: string;
  productName: string;
  productDescription: string;
  userPrompt: string;
  aspectRatio: string;
  targetLength: number;
  uploadedImages: string[];
  generatedImage: string;
  generatedVideo: string;
  isGenerating: boolean;
  isVideoGenerating?: boolean;
  isPublished: boolean;
  error: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PromptSuggestionResponse {
  suggestions: string[];
}
