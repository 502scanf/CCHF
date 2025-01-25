import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({

  plugins: [react()],
  base:"/CCHF",
  resolve:{
    alias:{
      '@assets': path.resolve('src/assets'),
      '@page': path.resolve('src/page')
    }
  }
})
