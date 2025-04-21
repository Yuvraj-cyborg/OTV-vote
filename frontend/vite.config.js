import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      // Test patterns for image files
      test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
      // Exclude public directory from processing
      exclude: /public\/.*/,
      // Image optimization options
      jpg: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      png: {
        quality: 80,
        compressionLevel: 9,
      },
      webp: {
        quality: 80,
        lossless: false,
      },
      avif: {
        quality: 70,
        lossless: false,
      },
      // Cache settings
      cache: true,
      cacheLocation: './node_modules/.cache/image-optimizer',
      // Directly serve optimized files in dev
      directProcess: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable brotli and gzip compression
    brotliSize: true,
    // Reduce sourcemap size in production
    sourcemap: process.env.NODE_ENV !== 'production' ? 'inline' : false,
    // Chunking strategy for better caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          if (id.includes('src/components')) {
            return 'components'
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (/\.(jpe?g|png|gif|svg|webp|avif)$/.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      // Add other frequently used dependencies here
    ],
    exclude: ['vite-plugin-image-optimizer'],
  }
})