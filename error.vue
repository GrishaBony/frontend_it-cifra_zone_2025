<script setup lang="ts">
import ThemeProvider from './components/themeProvider.vue';

const userStore = useUserStore();
const authStore = useAuthStore();

const props = defineProps<{
  error: { statusCode: number; message: string; }
}>()
const { statusCode, message } = props.error

const userMessage = computed(() => {
switch (statusCode) {
  case 401:
    return 'Ошибка инициализации пользователя. Пожалуйста, убедитесь что вы запускаете приложение через Telegram и перезапустите приложение.'
  case 404:
    return 'Страница не найдена.'
  case 500:
  default:
    return 'Произошла непредвиденная ошибка на сервере. Попробуйте позже.'
}
})

// ======= Ручная передача initData, только для dev =======
const isDev = import.meta.dev
const initData = ref();

const init = async () => {
  if (isDev) {
    const successLogin = await authStore.login(initData.value);

    if (userStore.isFirstLaunch) {
        await navigateTo({ path: '/welcome', query: { initData: initData.value } });
    } else if (successLogin) {
        await navigateTo('/newchat')
    } else {
        throw createError({
          statusCode: 401,
        })
    }
  } 
}
</script>

<template>
    <ClientOnly>
      <ThemeProvider>
        <div class="bg-white dark:bg-black flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <div class="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 shadow-lg rounded-2xl p-6 md:p-10 max-w-md w-full">
            <Icon
              name="bi:exclamation-circle-fill"
              size="48"
              class="text-red-500/90 mb-4 animate-pulse drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]"
            />
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Ошибка {{ statusCode }}
            </h1>
            <p class="text-sm text-gray-600 dark:text-neutral-300">
              {{ userMessage || 'Произошла неизвестная ошибка.' }}
            </p>

            <!-- ===== Подробности ошибки, только для dev ===== -->
            <div class="m-2 text-gray-200">
                {{ message }}
            </div>

            <!-- ======= Ручная передача initData, только для dev ======= -->
            <div v-if="isDev && statusCode === 401" class="flex flex-col items-end mt-8 w-full">
              <form class="flex w-full" @submit.prevent>
                <input
                  type="password"
                  placeholder="initData"
                  v-model="initData"
                  class="py-1.5 sm:py-2 px-3 pr-10 block w-full rounded-l-lg border border-gray-200 sm:text-sm focus:border-gray-300 focus:ring-gray-300 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                />
                <button
                  type="submit"
                  @click="init"
                  class="inset-y-0 right-0 flex items-center p-3 rounded-r-lg border border-gray-200 dark:border-neutral-700 bg-gray-300 text-neutral-700 hover:opacity-80"
                >
                  <Icon name="bi:arrow-right-circle-fill" class="w-5 h-5" />
                </button>
              </form>
              <span class="m-2 block mb-2 text-sm text-gray-500 dark:text-neutral-500">Это поле видно только в dev* режиме</span>
            </div>

          </div>
        
          <p class="mt-8 text-xs text-gray-500 dark:text-neutral-400">
            Автор: <a class="text-blue-300 hover:underline hover:text-blue-200" href="https://t.me/GrishkaRe" target="_blank">Григорий Ичетовкин</a>
            | Специально для <span class="text-blue-400 font-medium">IT-ЦИФРА.ZONE</span>
          </p>
      </div>
      </ThemeProvider>
    </ClientOnly>
</template>

<style scoped>

</style>