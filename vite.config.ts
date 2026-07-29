import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const target =
    env.FRAPPE_PROXY_TARGET ||
    env.VITE_FRAPPE_URL ||
    "http://healthcare.test:8000";

  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            query: ["@tanstack/react-query"],
            charts: ["recharts"],
            icons: ["lucide-react"]
          }
        }
      }
    },
    server: {
      host: "0.0.0.0",
      port: 8081,
      strictPort: true,
      proxy: {
        "/api": {
          target,
          changeOrigin: true,
          secure: false
        }
      }
    },
    test: {
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      css: true
    }
  };
});
