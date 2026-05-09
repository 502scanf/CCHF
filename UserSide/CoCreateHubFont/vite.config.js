import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        plugins: [react()],
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: './src/test/setup.js',
        },
        server: {
            proxy: {
                '/api': {
                    target: "http://localhost:8080",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '/cch'),
                    configure: (proxy, options) => {
                        // 添加代理事件监听器
                        proxy.on('proxyReq', (proxyReq, req, res) => {
                            console.log(`代理请求: ${req.method} ${req.url} -> ${options.target}${proxyReq.path}`);
                        });
                        proxy.on('proxyRes', (proxyRes, req, res) => {
                            console.log(`代理响应: ${req.url} -> ${proxyRes.statusCode}`);
                        });
                        proxy.on('error', (err, req, res) => {
                            console.error(`代理错误: ${err.message}`);
                        });
                    }
                },
                '/oss_upload': {
                    target: "http://localhost:8080",
                    changeOrigin: true,
                    // 不进行路径重写，直接使用 /oss_upload
                    rewrite: (path) => path.replace(/^\/oss_upload/, '/oss_upload')
                }
            }
        },
        resolve: {
            alias: {
                '@assets': path.resolve('src/assets'),
                '@page': path.resolve('src/page')
            }
        }

    }
})
