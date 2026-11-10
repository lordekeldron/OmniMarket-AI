import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Allow the Vercel preview hostnames while keeping Vite host validation enabled.
      allowedHosts: ['.vercel.run', '.v0.build'],
      // The Vercel preview proxy does not keep Vite's HMR WebSocket open.
      // Disable HMR to prevent the client from retrying a socket that cannot open.
      hmr: false,
      // Keep file watching available so the dev server still reloads on changes.
      watch: {},
    },
  };
});
