<template>
    <SidebarItem v-if="!isFolder" :to="`/chat/${props.chat.id}`">{{ props.chat.title }}</SidebarItem>
    <SidebarDropdownItem v-else-if="isFolder">
        <template #title>
            {{ props.chat.title }}
        </template>
        <SidebarChat v-for="child in chat.childBranches" :chat="child" :key="child.id" ></SidebarChat>
    </SidebarDropdownItem>
</template>

<script setup lang="ts">
import { SidebarDropdownItem, SidebarItem } from '#components';
import type { ChatDto } from '~/types/ChatApiDto';

import SidebarChat from './chat.vue'


const props = defineProps<{
    chat: ChatDto,
}>()

const isFolder = computed(() => props.chat.childBranches && props.chat.childBranches.length > 0)
</script>