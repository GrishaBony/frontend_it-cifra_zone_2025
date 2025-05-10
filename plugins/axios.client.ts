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
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        try {
          // Попытка обновить токены
          const refreshResponse = await api.post('auth/refresh');
          // После обновления токенов, отправляем повторный запрос
          const originalRequest = error.config;
          return api(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    },
  )

  // Регистрируем $api в контексте Nuxt
  nuxtApp.provide('api', api)
})
