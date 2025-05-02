<script setup lang="ts">
const { MainButton, useWebApp, useWebAppPopup } = await import('vue-tg')
// можно алиас прописать глобальный, чек доку

const { showAlert } = useWebAppPopup()

const { initDataUnsafe } = useWebApp()
</script>

<template>
    <section>
        <h1>Hello from my first <b>telegram mini app!</b></h1>

        <div class="p-8 bg-white rounded-lg">
            Oh, <p class="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">tailwind</p> work!
        </div>
        
        <input id="checkbox" type="checkbox" class="form-checkbox text-pink-300" />

        <div class="flex gap-x-3" data-hs-pin-input="">
          <input type="text" class="block w-9.5 text-center border-gray-200 rounded-md sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="⚬" data-hs-pin-input-item="">
          <input type="text" class="block w-9.5 text-center border-gray-200 rounded-md sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="⚬" data-hs-pin-input-item="">
          <input type="text" class="block w-9.5 text-center border-gray-200 rounded-md sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="⚬" data-hs-pin-input-item="">
          <input type="text" class="block w-9.5 text-center border-gray-200 rounded-md sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="⚬" data-hs-pin-input-item="">
        </div>

        <MainButton text="Вычислить по ip" color="rgba(0, 191, 111, 1)" @click="() => showAlert(`Привет, human! А я тут уже знаю что ты ${initDataUnsafe.user?.first_name}, а юз твой - @${initDataUnsafe.user?.username}`)"/>
    </section>
</template>

<style scoped>

</style>