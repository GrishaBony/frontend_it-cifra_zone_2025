<script setup lang="ts">
import { Role } from '~/types/Role.enum';

definePageMeta({
  layout: 'chat-list-layout',
  middleware: ['auth'],
  role: [Role.USER, Role.USER_ORG, Role.ADMIN]
});

const userStore = useUserStore();
const user = computed(() => userStore.user)

// for SSR
const profile = ref({
  photo: '',
  user: '',
  username: ''
})

onMounted(() => {
  const currentUser = user.value
  if (currentUser) {
    profile.value = {
      photo: currentUser.photo || currentUser.photoUrl || '',
      user: currentUser.name || currentUser.firstName + (currentUser?.lastName ? ` ${currentUser?.lastName}` : ''),
      username: `@${currentUser?.username}` || ''
    }
  }
})
</script>

<template>
    <div class="p-4 sm:p-6 space-y-4 sm:space-y-6 min-h-screen">
      <div class="flex p-3 z-100 bg-gray-50 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-t-2xl items-center gap-2">
          <NuxtImg v-if="profile.photo" class="inline-block size-32 rounded-full border-2 border-gray-800 dark:border-gray-200" :src="profile.photo" />
          <div class="flex flex-col text-sm text-gray-800 dark:text-gray-200">
            <div><p class="text-4xl font-bold">{{ profile.user }}</p></div>
            <div class="text-2xl font-bold text-gray-600 dark:text-gray-400"><p>{{ profile.username }}</p></div>
          </div>
      </div>
    </div>
</template>