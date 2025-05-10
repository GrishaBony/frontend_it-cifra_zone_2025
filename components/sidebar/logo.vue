<script setup lang="ts">
const isHovered = ref(false)

</script>

<template>
    <div class="w-full relative overflow-hidden">
        <NuxtImg 
            src="images/logo_full.png"
            alt="Логотип при наведении: GrishkaRe x AI" 
            class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        />
    </div>
</template>