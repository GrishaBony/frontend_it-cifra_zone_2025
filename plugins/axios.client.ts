import axios from 'axios'

export default defineNuxtPlugin(nuxtApp => {
  const api = axios.create({
    baseURL: useRuntimeConfig().public.API_BASE_URL,
    // headers: {
    //   'Content-Type': 'application/json'
    // },
    withCredentials: true,
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
  nuxtApp.provide('api', api)
})
