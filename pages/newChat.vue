<script setup lang="ts">
import { Role } from '~/types/Role.enum';

definePageMeta({
  layout: 'chat-list-layout',
  middleware: ['auth'],
  role: [Role.USER, Role.USER_ORG, Role.ADMIN]
});

const refreshBus = useEventBus('refresh-chats')

const createChat = async () => {
  const chat = await useChatApi().createChat();
  await navigateTo(`/chat/${chat?.id}`);
  refreshBus.emit();
}

</script>

<template>
    <div class="p-4 sm:p-6 min-h-screen justify-center items-center flex flex-col gap-2 dark:text-white">
      <h1 class="text-center text-3xl font-bold">Добро пожаловать!</h1>
      <h1 class="text-center text-2xl font-bold">GrishkaRe x AI</h1>
      <button @click="createChat" class="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800">
          Создать чат
      </button>
    </div>
</template>