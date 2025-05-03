<script setup lang="ts">
import ThemeProvider from '~/components/themeProvider.vue';

</script>

<template>
  <NuxtLayout>
    <ClientOnly>
      <ThemeProvider>
        <NuxtPage />
      </ThemeProvider>
    </ClientOnly>
  </NuxtLayout>
  
</template>
