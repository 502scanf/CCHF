import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
        plugins: [react()],
      // base:"/CCHF/",
      server:{
            proxy:{
                '/api':{
                    target: "http://localhost:8080",
                    changeOrigin: true,
                    rewrite:(path)=>path.replace(/^\/api/,'/cch')
                }
            }
      },
        resolve:{
        alias:{
            '@assets': path.resolve('src/assets'),
            '@page': path.resolve('src/page')
        }
        }

    }
})
