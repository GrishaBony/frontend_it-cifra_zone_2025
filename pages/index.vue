<script setup lang="ts">
const { MainButton, useWebApp, useWebAppPopup } = await import('vue-tg')

const { showAlert } = useWebAppPopup()

const { ready, initData, initDataUnsafe, close } = useWebApp()

ready();

if (!initData) {
    throw createError({
    statusCode: 401,
  })
}

</script>

<template>
    <!-- <section> -->
    <div class="flex flex-col items-center h-screen">
        <div class="flex flex-col items-center justify-center h-full">
            <div class="flex flex-col m-4 bg-gray-100 border border-gray-200 shadow-2xs rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
                <div class="animate-spin inline-block size-6 border-3 border-current border-t-transparent text-gray-800 rounded-full dark:text-white" role="status" aria-label="loading"></div>
            </div>
        </div>
        <p class="m-2 text-sm text-gray-950 dark:text-neutral-400">
           Автор: <a class="text-blue-300 hover:underline hover:text-blue-200" href="https://t.me/GrishkaRe" target="_blank">Григорий Ичетовкин</a>
           | <span class="text-blue-400 font-medium">IT-ЦИФРА.ZONE</span>
         </p>
    </div>
</template>

<style scoped>

</style>