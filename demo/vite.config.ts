import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "sonus-js": fileURLToPath(new URL("../src/index.ts", import.meta.url)),
    },
  },
});
