import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Évite de bundler xlsx/jspdf côté serveur (gros buffers mémoire)
  serverExternalPackages: ["xlsx", "jspdf", "jspdf-autotable"],
};

export default nextConfig;
