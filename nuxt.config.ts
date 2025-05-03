import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/image', '@nuxt/icon', '@pinia/nuxt'],
  icon: {
    serverBundle: {
      collections: ['bi']
    }
  },
  vite: {
    server: {
      allowedHosts: ['grishkare-ai-mini-app.loca.lt']
    },
    plugins: [
      tailwindcss(),
    ],
  },
});