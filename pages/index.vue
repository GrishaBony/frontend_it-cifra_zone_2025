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

        <MainButton text="Вычислить по ip" color="rgba(0, 191, 111, 1)" @click="() => showAlert(`Привет, human! А я тут уже знаю что ты ${initDataUnsafe.user?.first_name}, а юз твой - @${initDataUnsafe.user?.username}`)"/>
    </section>
</template>

<style scoped>

</style>