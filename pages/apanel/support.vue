<script setup lang="ts">
import { Role } from '~/types/Role.enum';

definePageMeta({
  layout: 'admin-layout',
  middleware: ['auth'],
  role: [Role.ADMIN]
});

const tickets = ref()

onMounted(async() => {
  tickets.value = await useSupportApi().getAll()
})
</script>

<template>
    <div class="p-4 min-h-screen">
      <div v-if="tickets" v-for="(ticket, index) in tickets" :key="index">
        <div class="bg-white dark:bg-neutral-800 shadow-lg rounded-xl p-6">
          <p class="text-sm font-bold text-neutral-900 dark:text-neutral-100">{{ 'тип обращения: ' + ticket.type }}</p>
          <h1 class="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">{{ ticket.theme }}</h1>
          <div class="h-0.5 w-full bg-black dark:bg-white"></div>
          <p class="mt-2 font-bold text-neutral-900 dark:text-neutral-100">{{ ticket.description }}</p>
          <div class="p-4 w-full flex gap-4">
            <NuxtImg class="inline-block size-8 rounded-full border-2 border-gray-800 dark:border-gray-200" :src="ticket.user.photoUrl" />
            <div class="flex flex-col text-sm text-gray-800 dark:text-gray-200">
              <div><p>{{ ticket.user.name || ticket.user.firstName + ' ' + ticket.user.lastName }}</p></div>
              <div class="text-xs text-gray-600 dark:text-gray-400"><p>@{{ ticket.user.username }}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>