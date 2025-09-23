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
                // "@saas-crm/shared": path.resolve(__dirname, "../shared"),
            },
        },
        server: {
            port: 3006,
            proxy: {
                '/api': env.VITE_API_BASE_URL,
            },
        },
    };
});
