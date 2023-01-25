import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslintPlugin()],
  server: {
    proxy: {
      "/api-server": {
        target: "http://localhost:8880",
        rewrite: (path: string) => path.replace(/^\/api-server/, ""),
      }
    }
  },
  
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          antd: ["antd"],
          lodash: ["lodash-es"],
        },
        chunkFileNames(chunkInfo) {
          const { name, facadeModuleId } = chunkInfo;
          if (name === "index" || name === "main") {
            const dirs = facadeModuleId.split("/");
            return `assets/${dirs[dirs.length - 2]}.[hash].js`;
          } else {
            return "assets/[name].[hash].js";
          }
        }
      }
    }
  }
})
