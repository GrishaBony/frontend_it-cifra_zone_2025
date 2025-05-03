<script setup lang="ts">
import { useTheme } from 'vue-tg'

const theme = useTheme()
const themeStore = useThemeStore()

themeStore.setTheme(theme);

theme.onChange(() => {
    themeStore.setTheme(theme)
    alert('theme changed' + themeStore.colorScheme + themeStore.backgroundColor)
})

</script>

<template>
    <Notivue v-slot="item">
      <NotivueSwipe :item="item">
        <Notification :item="item" :theme="themeStore.colorScheme === 'dark' ? darkTheme : lightTheme">
          <NotificationProgress :item="item" />
        </Notification>
      </NotivueSwipe>
    </Notivue>

    <div :class="`background-color: ${themeStore.backgroundColor}`">
        <slot />
    </div>
</template>