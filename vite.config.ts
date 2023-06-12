import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api/v1/vworld": {
                target: "http://api.vworld.kr",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/v1\/vworld/, "/req/search"),
            },
        },
    },
});
