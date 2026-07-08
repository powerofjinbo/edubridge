import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  base: isGitHubPages ? "/edubridge/" : "/",
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET || "http://localhost:8787",
        changeOrigin: true
      }
    }
  }
});
