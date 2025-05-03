<script setup lang="ts">
import { useTheme } from 'vue-tg'
import { useThemeStore } from '~/stores/theme.store';

const theme = useTheme()
const themeStore = useThemeStore()

themeStore.setTheme(theme);

theme.onChange(() => {
    themeStore.setTheme(theme)
    alert('theme changed' + themeStore.colorScheme + themeStore.backgroundColor)
})

</script>

<template>
    <div :class="`background-color: ${themeStore.backgroundColor}`">
        <slot />
    </div>
</template>