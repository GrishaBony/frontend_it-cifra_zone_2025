<script setup lang="ts">
useHead({
    script: [
        { src: 'https://telegram.org/js/telegram-web-app.js', defer: true }
    ]
});
</script>

<template>
    <main>
        <ClientOnly>
            <slot />
        </ClientOnly>
    </main>
</template>

<style scoped>

</style>