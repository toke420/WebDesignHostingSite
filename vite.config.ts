import { defineConfig, loadEnv } from "vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.HELPDESK_PROXY_TARGET || "http://127.0.0.1:8080";
  const content = env.CONTENT_PROXY_TARGET || "http://127.0.0.1:8090";
  const proxy = {
    "/widget.js": { target, changeOrigin: true },
    "/api/widget": { target, changeOrigin: true },
    // Content server: live site content, the /admin API and uploaded images.
    "/api/content": { target: content },
    "/api/admin": { target: content },
    "/uploads": { target: content },
    "/sitemap.xml": { target: content },
    "/blog/rss.xml": { target: content },
  };
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "admin-trailing-slash",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === "/admin") {
              res.writeHead(301, { Location: "/admin/" });
              return res.end();
            }
            next();
          });
        },
        configurePreviewServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === "/admin") {
              res.writeHead(301, { Location: "/admin/" });
              return res.end();
            }
            next();
          });
        },
      },
    ],
    build: {
      rollupOptions: {
        input: {
          main: resolve(import.meta.dirname, "index.html"),
          admin: resolve(import.meta.dirname, "admin/index.html"),
        },
      },
    },
    server: { port: 5173, strictPort: true, proxy },
    preview: { port: 4173, proxy },
  };
});
