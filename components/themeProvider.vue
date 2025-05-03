<script setup lang="ts">
import { useTheme } from 'vue-tg'

const theme = useTheme()
const themeStore = useThemeStore()

onMounted(() => {
    themeStore.setTheme(theme)

    watch(() => useUserStore().isTg, (isTg) => {
        if (isTg != null) {
            themeStore.setTheme(theme)
        }
    }, { once: true })
})

theme.onChange(() => {
    themeStore.setTheme(theme)
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

    <div :style="`background-color: ${themeStore.backgroundColor}`">
        <slot />
    </div>
</template>