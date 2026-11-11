import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const page = (name) => fileURLToPath(new URL(name, import.meta.url));

export default defineConfig({
    // Relative paths, so the built site works under any address (GitHub Pages serves it from /my-website/)
    base: "./",
    plugins: [react()],
    build: {
        rollupOptions: {
            // Two pages, each with its own React app
            input: { portfolio: page("index.html"), beyond: page("beyond.html") },
        },
    },
});
