<script setup lang="ts">
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  to: {
    type: String,
    required: true,
  }
})

const route = useRoute()
const isActive = computed(() => route.path === props.to)
</script>

<template>
    <li>
      <NuxtLink 
        :to="to" 
        class="w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" 
        :class="{ 
          'bg-gray-100 dark:bg-neutral-600' : isActive,
          'dark:bg-neutral-800' : !isActive,
        }">
        <div v-if="isLoading" class="animate-pulse h-4 w-full shrink-0 bg-gray-400 rounded-sm dark:bg-neutral-400" />
        <slot v-else />
      </NuxtLink>
    </li>
</template>