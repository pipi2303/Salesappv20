import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// `vercel dev` assigns a random port via the PORT env var and expects
// the dev server to actually bind to it -- if it doesn't, port detection
// times out after 5 minutes and `vercel dev` fails outright (the port
// used to be hardcoded to 5174 here, which is exactly what broke it).
// Falls back to 5174 for plain `npm run dev` (no PORT set).
const port = Number(process.env.PORT) || 5174;

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  server: {
    port,
    strictPort: true,
    hmr: {
      host: 'localhost',
      port,
      clientPort: port,
    },
  },
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['lucide-react', 'sonner', 'recharts'],
          'form-vendor': ['react-hook-form'],
        },
      },
    },
  },
})