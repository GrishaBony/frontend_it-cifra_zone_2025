<script setup lang="ts">
const { useWebApp } = await import('vue-tg')
const { ready, initData, initDataUnsafe } = useWebApp()

const isDev = import.meta.dev

onMounted(async () => {
    const userStore = useUserStore();
    const authStore = useAuthStore();

    ready();

    userStore.initDataUnsafe = initDataUnsafe;

    if (!initData) {
        throw createError({
        statusCode: 401,
      })
    }

    // Зарежка для dev режима, что бы можно было скопировать initData при необходимости
    if (isDev) {
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    const successLogin = await authStore.login(initData);

    if (successLogin === false) {
        await navigateTo({ path: '/welcome', query: { initData: initData }});
    } else if (successLogin === true) {
        await navigateTo('/newchat');
    } else {
        throw createError({
          statusCode: 401,
        })
    }
})

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

    <!-- ======= initData, только для dev ======= -->
    <div v-if="isDev" class="border-t-2 border-gray-400 w-full">
        <input type="text" v-model="initData" class="w-full text-gray-700 h-8 p-2 bg-transparent outline-none border-none focus:outline-none hover:outline-none focus:ring-0">
    </div>
</template>

<style scoped>

</style>