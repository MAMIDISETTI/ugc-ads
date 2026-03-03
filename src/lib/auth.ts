import { NextRequest } from "next/server";
import { verifyToken, JWTPayload } from "./jwt";

export function getAuth(req: NextRequest): JWTPayload | null {
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  return verifyToken(token);
}
