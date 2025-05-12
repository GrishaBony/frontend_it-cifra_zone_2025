<script setup lang="ts">
import { Role } from '~/types/Role.enum';

definePageMeta({
//   layout: 'admin-layout',
  middleware: ['auth'],
  role: [Role.ADMIN]
});

onMounted(() => {
    navigateTo('/apanel/users')
})
</script>

<template />