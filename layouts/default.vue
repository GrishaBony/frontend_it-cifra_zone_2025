<script setup lang="ts">
import ThemeProvider from '~/components/themeProvider.vue';

useHead({
    script: [
        { src: 'https://telegram.org/js/telegram-web-app.js', defer: true }
    ]
});
</script>

<template>
    <main>
        <ClientOnly>
            <ThemeProvider>
                <slot />
            </ThemeProvider>
        </ClientOnly>
    </main>
</template>

<style scoped>

</style>