import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ssr: false,
  app: {
    head: {
      script: [
        { src: 'https://telegram.org/js/telegram-web-app.js', defer: true }
      ]
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: [
    'notivue/notification.css',
    'notivue/animations.css',
    '~/assets/css/main.css',
  ],
  modules: ['@nuxt/image', '@nuxt/icon', '@pinia/nuxt', 'notivue/nuxt', '@vueuse/nuxt'],
  icon: {
    serverBundle: {
      collections: ['bi']
    }
  },
  notivue: {
    limit: 4,
  },
  vite: {
    server: {
      allowedHosts: ['grishkare-ai-mini-app.loca.lt']
    },
    plugins: [
      tailwindcss(),
    ],
  },
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
    }
  }
});