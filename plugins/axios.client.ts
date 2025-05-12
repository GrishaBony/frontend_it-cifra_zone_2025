import axios, { AxiosError, type AxiosRequestConfig } from 'axios'

export default defineNuxtPlugin(nuxtApp => {
  const api = axios.create({
    baseURL: useRuntimeConfig().public.API_BASE_URL,
    // headers: {
    //   'Content-Type': 'application/json'
    // },
    withCredentials: true,
  })

  // === Interceptors ===
  if (process.client) {
    api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config as AxiosRequestConfig & { _retry?: boolean }
  
        if (!config) return Promise.reject(error)
  
        const url = config.url || ''
        const isRefreshRequest = url.includes('auth/refresh')
  
        if (isRefreshRequest || config._retry) {
          return Promise.reject(error)
        }
        
        if (error.response?.status === 401) {
          config._retry = true
          try {
            await api.post('/auth/refresh')  // тут ведущий слэш
            // После успешного рефреша повторяем исходный запрос
            return api(config)
          } catch (e) {
            // Если даже рефреш упал — отказываемся
            return Promise.reject(e)
          }
        }
  
        return Promise.reject(error);
      },
    )
  }

  // Регистрируем $api в контексте Nuxt
  nuxtApp.provide('api', api)
})
