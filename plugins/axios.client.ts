import axios from 'axios'

export default defineNuxtPlugin(nuxtApp => {
  const api = axios.create({
    baseURL: process.env.API_BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // === Interceptors ===
  api.interceptors.request.use(config => {
    // const auth = useAuthStore()
    // if (auth.token) {
    //   config.headers.Authorization = `Bearer ${auth.token}`
    // }
    return config
  })

  // Регистрируем $api в контексте Nuxt
  nuxtApp.provide('$api', api)
})
