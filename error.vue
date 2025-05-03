<script setup lang="ts">
const props = defineProps<{
  error: { statusCode: number; }
}>()

const { statusCode } = props.error

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
</script>

<template>
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
      </div>

      <p class="mt-8 text-xs text-gray-500 dark:text-neutral-400">
        Автор: <a class="text-blue-300 hover:underline hover:text-blue-200" href="https://t.me/GrishkaRe" target="_blank">Григорий Ичетовкин</a>
        | Специально для <span class="text-blue-400 font-medium">IT-ЦИФРА.ZONE</span>
      </p>
  </div>
</template>

<style scoped>

</style>