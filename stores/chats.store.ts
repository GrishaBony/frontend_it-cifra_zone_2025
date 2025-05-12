import type { ChatWithMessagesDto } from "~/types/ChatApiDto";

export const userChatsStore = defineStore('userChats', () => {
    const chats = ref<ChatWithMessagesDto[]>([])

    const addChat = (chat: ChatWithMessagesDto) => {
        chats.value.push(chat)
    }

    const findChatById = (id: string): ChatWithMessagesDto | undefined => {
        return chats.value.find((c) => c.id === id)
    }

    return { chats, addChat, findChatById }
});