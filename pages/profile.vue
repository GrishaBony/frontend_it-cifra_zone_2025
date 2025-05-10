<script setup lang="ts">
import { Role } from '~/types/Role.enum';

definePageMeta({
  layout: 'chat-list-layout',
  middleware: ['auth'],
  role: [Role.USER, Role.USER_ORG, Role.ADMIN]
});
</script>

<template>
    <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
      profile
    </div>
</template>