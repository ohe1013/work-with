import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    outDir: "build",
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api/v1/vworld": {
        target: "http://api.vworld.kr",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1\/vworld/, "/req/search"),
      },
      "/api/v1/kakao/search": {
        target: "https://map.kakao.com",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api\/v1\/kakao\/search/, "/api/dapi/suggest/hub"),
      },
    },
  },
});
