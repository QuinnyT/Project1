import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const CopyWebpackPlugin = require('copy-webpack-plugin');

// https://vitejs.dev/config/
export default defineConfig({
  build:{
    rollupOptions:{
      output:{
        entryFileNames:'index.js',
        assetFileNames:'assets/[name][extname]',
        chunkFileNames:'[name].js'
      }
    }
  },
  base: './',
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  configureWebpack: (config) => {
    plugins: {
      new CopyWebpackPlugin ([{
        from: '/static/',
        to: 'static'
      }])
    }
  }
})
