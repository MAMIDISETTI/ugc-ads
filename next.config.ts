import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose", "bcryptjs", "jsonwebtoken"],
};

export default nextConfig;
