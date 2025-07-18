import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === "production";
  const isDevelopment = command === "serve";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: true,
      hmr: false,
      ws: false,
      cors: true,
      watch: {
        usePolling: true,
        interval: 1000,
      },
      fs: {
        strict: false,
      },
    },

    preview: {
      host: "0.0.0.0",
      port: 5173,
    },
  };
});
