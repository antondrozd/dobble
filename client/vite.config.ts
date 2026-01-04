import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), checker({ typescript: true })],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  preview: {
    port: 8080,
  },
});
