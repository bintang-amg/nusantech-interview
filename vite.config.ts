/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const TMDB_TARGET = "https://api.themoviedb.org/3";

export default defineConfig(({ mode }) => {
  // loadEnv with "" loads server-side vars too (including non-VITE_ secrets).
  // TMDB_API_KEY stays in the dev server process and is never bundled.
  const env = loadEnv(mode, process.cwd(), "");
  const apiKey = env.TMDB_API_KEY;

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/tmdb": {
          target: TMDB_TARGET,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => {
            const stripped = path.replace(/^\/api\/tmdb/, "");
            if (!apiKey) return stripped;
            const separator = stripped.includes("?") ? "&" : "?";
            return `${stripped}${separator}api_key=${apiKey}`;
          },
        },
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      css: true,
      restoreMocks: true,
    },
  };
});
