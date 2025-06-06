import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    // server: {
    //     host: '0.0.0.0',
    //     port: 5176,
    //     strictPort: true,
    //     hmr: {
    //         host: '192.168.1.2',
    //     },
    // },
});
