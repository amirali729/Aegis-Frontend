import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],

  server: {
    port: 5173,
    open: true,
  },

  preview: {
    port: 4173,
  },

  build: {
    target: "es2022",
    sourcemap: false,
    minify: "esbuild",
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
  },

  resolve: {
    dedupe: ["react", "react-dom"],
  },
});
