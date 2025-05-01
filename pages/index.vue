<script setup lang="ts">
const { MainButton, useWebApp, useWebAppPopup } = await import('vue-tg')
// можно алиас прописать глобальный, чек доку

const { showAlert } = useWebAppPopup()

const { initDataUnsafe } = useWebApp()
</script>

<template>
    <section>
        <h1>Hello from my first <b>telegram mini app!</b></h1>

        <MainButton text="Вычислить по ip" color="rgba(0, 191, 111, 1)" @click="() => showAlert(`Привет, human! А я тут уже знаю что ты ${initDataUnsafe.user?.first_name}, а юз твой - @${initDataUnsafe.user?.username}`)"/>
    </section>
</template>

<style scoped>

</style>