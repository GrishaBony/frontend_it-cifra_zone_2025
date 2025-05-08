<script setup lang="ts">
defineProps({
    username: String
})

defineEmits(['next'])
</script>

<template>
    <div>
        <h1 class="text-[clamp(1.5rem,5vw,1.875rem)] font-bold text-gray-900 dark:text-white mb-4">Добро пожаловать!</h1>
        <p class="text-gray-600 dark:text-gray-300 mb-8">
          Привет, <span class="font-semibold text-cyan-600">{{ username }}</span>! Рады видеть вас.
          Приготовьтесь познавать мир ИИ.
        </p>
        <button
          @click="$emit('next')"
          class="w-full py-3 px-6 rounded-lg text-lg font-semibold bg-cyan-600 text-white hover:bg-cyan-700 focus:outline-none active:bg-cyan-500 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
        >
          Продолжить
        </button>
    </div>
</template>