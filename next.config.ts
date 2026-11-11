import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the bcrypt work and Prisma on the Node.js runtime.
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
