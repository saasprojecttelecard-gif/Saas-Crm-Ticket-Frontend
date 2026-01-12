import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
    // Load environment variables
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [
            react(),
            tailwindcss(),
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        optimizeDeps: {
            include: [
                'react',
                'react-dom',
                'antd',
                '@saas-crm/shared'
            ],
            force: true,
            esbuildOptions: {
                // Ignore source map errors
                ignoreAnnotations: true,
            }
        },
        define: {
            global: 'globalThis',
        },
        server: {
            port: process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 3006,
            proxy: {
                '/api': env.VITE_API_BASE_URL,
            },
        },
    };
});
