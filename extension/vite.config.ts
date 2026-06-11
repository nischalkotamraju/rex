import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

const isProd = process.env.NODE_ENV === 'production'
const useLocalUrls = process.env.LOCAL_URLS === 'true' || !isProd

export default defineConfig({
  define: {
    __SERVER_URL__: JSON.stringify(
      useLocalUrls ? 'http://localhost:3001' : 'https://rex-server.up.railway.app'
    ),
    __WEBSITE_URL__: JSON.stringify(
      useLocalUrls ? 'http://localhost:3000' : 'https://getrex.ai'
    ),
    __SUPABASE_URL__: JSON.stringify('https://xncywsarjinlmuqvffop.supabase.co'),
    __SUPABASE_ANON_KEY__: JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuY3l3c2FyamlubG11cXZmZm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMzQyMDMsImV4cCI6MjA5NDYxMDIwM30.-EF3l-1O-eXLbjYfC3G56Pi_Di2ZrJ17ASDRC9tsAxE'),
  },
  plugins: [
    react(),
    crx({ manifest }),
  ],
  build: {
    minify: false,
    sourcemap: true,
  },
})
