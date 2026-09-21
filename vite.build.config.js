import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Production build of the popup page.
//
// The dev config (vite.config.js) uses @crxjs to serve a live-reloading
// extension. This one is deliberately plain: it compiles index.html into
// build/ and copies public/ alongside it, leaving the content scripts,
// background worker and manifest to webpack and utils/build.js.
export default defineConfig({
  // Relative asset URLs so the popup resolves them from the extension root.
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  plugins: [react()],
  build: {
    outDir: "build",
    emptyOutDir: true,
    // MV3 forbids inline scripts, and the preload polyfill is injected inline.
    polyfillModulePreload: false,
  },
});
