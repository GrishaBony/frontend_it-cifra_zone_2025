<script setup lang="ts">
import { Role } from '~/types/Role.enum';

definePageMeta({
  layout: 'admin-layout',
  middleware: ['auth'],
  role: [Role.ADMIN]
});
</script>

<template>
    <div class="p-4 min-h-screen">
      about
    </div>
</template>