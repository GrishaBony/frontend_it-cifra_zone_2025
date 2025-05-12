<script setup lang="ts">
import type { ChatWithMessagesDto, Message } from '~/types/ChatApiDto';
import { Role } from '~/types/Role.enum'; 
import { marked } from 'marked';
import type { AIModelDto } from '~/types/AIModelDto';

definePageMeta({
  layout: 'chat-list-layout',
  middleware: ['auth'],
  role: [Role.USER, Role.USER_ORG, Role.ADMIN]
});

const route = useRoute();
const chatsStore = userChatsStore();
const userStore = useUserStore();
const chatApi = useChatApi();

const chatId = route.params.chatId.toString();
const chat = ref<ChatWithMessagesDto | null>(null);
const availableModels = ref<AIModelDto[]>([]);
const selectedModelId = ref<number | null>(null); // Store the selected model ID
const isLoading = ref(true);
const isSending = ref(false);
const isBranching = ref(false); 
const branchingMessageId = ref<string | null>(null);
const copiedMessageId = ref<string | null>(null); 
const chatContainer = ref<HTMLElement | null>(null); // Ref for scrolling

const refreshBus = useEventBus('refresh-chats')

const chatTitle = ref('')

const userAvatar = computed(() => userStore.user?.photo || userStore.user?.photoUrl); // Provide a default avatar path

// --- Functions ---
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

//FIXME - Опасно так использовать v-html с пользовательским контентом
// https://github.com/cure53/DOMPurify
const renderMarkdown = (content: string) => {
  if (!content) return '';
  try {
    // GitHub Flavored Markdown: marked.use(gfmHeadingId())
    return marked.parse(content, { async: false }) as string;
  } catch {
    return content;
  }
};

const fetchChatAndModels = async () => {
  isLoading.value = true;
  try {
    // Fetch Models
    availableModels.value = await useAIModelApi().getAIModels() ?? [];
    if (!selectedModelId.value && availableModels.value.length > 0) {
       const freeModel = availableModels.value.find(m => m.isFree);
       selectedModelId.value = freeModel?.id ?? availableModels.value[0].id;
    }

    const savedChat = chatsStore.findChatById(chatId);
    if (!savedChat) {
      const fetchedChat = await chatApi.getChatById(chatId);
      if (!fetchedChat) {
        return navigateTo('/newchat'); 
      }
      chat.value = fetchedChat;
      chatsStore.addChat(chat.value); 
    } else {
      chat.value = savedChat;
      // const updatedChat = await chatApi.getChatById(chatId);
      // if (updatedChat) chat.value = updatedChat;
    }

    chatTitle.value = chat.value.title;

    useHead({ title: `${chat.value?.title ?? 'Chat'} | GrishkaRe x AI` });
    scrollToBottom();

  } finally {
    isLoading.value = false;
  }
};

const handleSendMessage = async ({ content, modelId }: { content: string; modelId: number | null }) => {
  if (!content.trim() || !chat.value || !modelId || isSending.value) {
    // console.warn("Отмена отправки сообщения:", { content, chatExists: !!chat.value, modelId, isSending: isSending.value });
    return;
  }

  isSending.value = true;

  const userMessage: Message = {
    id: `temp-${Date.now()}`, // Temporary ID 
    chatId: chat.value.id,
    content: content.trim(),
    role: Role.USER, 
    createdAt: new Date().toISOString(),
    llmId: null,
    llm: null,
  };

  chat.value.messages.push(userMessage);
  scrollToBottom();

  try {
    const responseMessage = await chatApi.sendMessage(chat.value.id, content.trim(), modelId);

    if (responseMessage) {
      // Replace optimistic user message if API provides it back (optional)
      // const userMsgIndex = chat.value.messages.findIndex(m => m.id === userMessage.id);
      // if (userMsgIndex > -1) chat.value.messages.splice(userMsgIndex, 1);

      // Add AI response
      chat.value.messages.push(responseMessage);

      // Update store (optional, depends on your store's logic)
      // chatsStore.addMessageToChat(chat.value.id, responseMessage);

       scrollToBottom();
    } else {
      const userMsgIndex = chat.value.messages.findIndex(m => m.id === userMessage.id);
      if (userMsgIndex > -1) {
           // Option 1: Add error indicator to the optimistic message
           // chat.value.messages[userMsgIndex].error = true;
           // Option 2: Remove the optimistic message
           chat.value.messages.splice(userMsgIndex, 1);
           // Show error toast to user
           console.error("Failed to send message and get response.");
      }
    }

  } catch (error) {
    console.error("Error sending message:", error);
    // Handle error - potentially remove optimistic message
    const userMsgIndex = chat.value.messages.findIndex(m => m.id === userMessage.id);
    if (userMsgIndex > -1) chat.value.messages.splice(userMsgIndex, 1);
    // error toast 
  } finally {
    isSending.value = false;
  }
};


onMounted(async () => {
  await fetchChatAndModels();

  // PrelineUI init
  nextTick(() => {
    // @ts-ignore
    if (process.client && window.HSStaticMethods) {
       // @ts-ignore
       window.HSStaticMethods.autoInit();
    }
  });
});

watch(() => chat.value?.messages?.length, () => {
  scrollToBottom();
});

// --- Message Actions ---

// Copy Message Content to Clipboard
const copyMessageContent = async (content: string, messageId: string) => {
    if (!navigator.clipboard) {
        console.warn("Clipboard API not available.");
        // Add fallback mechanism if needed (e.g., textarea selection)
        // Example: toast.warn("Clipboard API not supported in your browser.");
        return;
    }
    try {
        await navigator.clipboard.writeText(content);
        copiedMessageId.value = messageId; // Set copied ID for feedback
        // Example: toast.success("Message copied!");
        setTimeout(() => { copiedMessageId.value = null; }, 1500); // Reset after a delay
    } catch (err) {
        console.error('Failed to copy message: ', err);
        // Example: toast.error("Failed to copy message.");
    }
};

// Create a New Chat Branch from a Message
const branchFromMessage = async (messageId: string) => {
    if (!chat.value || isBranching.value) return;

    isBranching.value = true;
    branchingMessageId.value = messageId;

    try {
        console.log(`Branching chat ${chat.value.id} after message ${messageId}`);
        const newChat : ChatWithMessagesDto = await chatApi.branchChat(chat.value.id, { branchedAfterMessageId: messageId });
        
        //TODO - vremenno
        const lastMessageId = chat.value.messages[chat.value.messages.length - 1].id;
        await chatApi.branchChat(chat.value.id, { branchedAfterMessageId: lastMessageId });

        if (newChat && newChat.id) {
            console.log("Branch created successfully:", newChat.id);
             // 1. Add the new chat to the Pinia store
            const _chat = chatsStore.findChatById(newChat.id);
            if (!_chat) {
              chatsStore.addChat(newChat);
            }

            // 2. Navigate to the new chat
            await navigateTo(`/chat/${newChat.id}`);
            // No need to manually refresh layout if it reads from the store reactively
            refreshBus.emit();

        } else {
             console.error("Branching API did not return a valid new chat object.");
             // Show error toast
        }
    } catch (error) {
        console.error("Error branching chat:", error);
        // Show error toast to user
        // Example: toast.error("Failed to create chat branch. Please try again.");
    } finally {
        isBranching.value = false;
        branchingMessageId.value = null;
    }
};

const changeTitle = async () => {
  await useChatApi().updateChat(chat.value?.id, { title: chatTitle.value } );
  refreshBus.emit();
}

</script>

<template>
  <div class="flex flex-col h-screen bg-neutral-50 dark:bg-neutral-900">
    <div v-if="isLoading" class="flex justify-center items-center flex-grow">
      <div class="animate-spin inline-block size-8 border-[3px] border-current border-t-transparent text-cyan-600 rounded-full dark:text-cyan-500" role="status" aria-label="loading">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div v-else-if="chat" class="flex flex-col flex-grow overflow-hidden">
      <header class="flex gap-2 p-4 border-b border-neutral-200 dark:border-neutral-700 text-center sticky top-0 bg-neutral-50 dark:bg-neutral-900 z-10">
         <input v-model="chatTitle" type="text" class="z-100 py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-gray-500 focus:ring-gray-500 disabled:opacity-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Название чата..">
         <button @click="changeTitle" class="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800">
            Сохранить
        </button>
       </header>

      <div ref="chatContainer" class="custom-scrollbar flex-grow overflow-y-auto p-4 md:p-6 lg:p-8 space-y-4 scroll-smooth">
        <div v-for="message in chat.messages" :key="message.id" class="flex w-full" :class="{ 'justify-end': message.role === Role.USER }">
          <div class="flex gap-2 max-w-[80%] sm:max-w-[70%]" :class="{ 'flex-row-reverse': message.role === Role.USER }">

            <div class="shrink-0">
               <img v-if="message.role === Role.USER"
                   :src="userAvatar"
                   alt="User"
                   class="size-8 rounded-full object-cover">
               <div v-else class="flex justify-center items-center size-8 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300">
                   <Icon name="ph:robot-duotone" size="20" /> </div>
            </div>

            <div class="grow flex flex-col group" :class="{ 'items-end': message.role === Role.USER, 'items-start': message.role !== Role.USER }">
               <div
                 class="p-3 rounded-lg text-sm sm:text-base relative"
                 :class="{
                   'bg-cyan-500 text-white dark:bg-cyan-600': message.role === Role.USER,
                   'bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200': message.role !== Role.USER
                 }"
               >
                 <div
                    v-if="message.role !== Role.USER"
                    v-html="renderMarkdown(message.content)"
                    class="prose prose-sm dark:prose-invert max-w-none hljs"></div>
                 <p v-else class="whitespace-pre-wrap">{{ message.content }}</p>
               </div>

                <div v-if="message.role !== Role.USER && message.llm" class="mt-1 text-xs text-neutral-500 dark:text-neutral-400" :class="{ 'text-right': message.role === Role.USER }">
                 {{ message.llm.displayName }}
                 <span v-if="message.llm.isFree" class="text-green-600 dark:text-green-400">(free)</span>
               </div>

               <!-- action buttons -->
               <div
                 class="mt-1.5 flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                 :class="{ 'justify-end': message.role === Role.USER, 'justify-start': message.role !== Role.USER }"
                 >
                    <button
                      @click="copyMessageContent(message.content, message.id)"
                      type="button"
                      class="text-neutral-500 hover:text-cyan-600 dark:text-neutral-400 dark:hover:text-cyan-400 p-1 rounded"
                      :aria-label="copiedMessageId === message.id ? 'Copied' : 'Copy message'"
                      title="Copy message"
                      >
                        <Icon v-if="copiedMessageId === message.id" name="ph:check-bold" size="16"/>
                        <Icon v-else name="ph:copy-duotone" size="16"/>
                    </button>

                    <button
                        v-if="!(isBranching && branchingMessageId === message.id) /* && index < chat.messages.length -1 */"
                        @click="branchFromMessage(message.id)"
                        type="button"
                        class="text-neutral-500 hover:text-cyan-600 dark:text-neutral-400 dark:hover:text-cyan-400 p-1 rounded"
                        aria-label="Create branch from this message"
                        title="Create branch from this message"
                        :disabled="isBranching"
                        >
                        <Icon name="ph:git-fork-duotone" size="16"/>
                     </button>
                     <div v-else-if="isBranching && branchingMessageId === message.id" class="p-1">
                          <div class="animate-spin inline-block size-4 border-[2px] border-current border-t-transparent text-cyan-500 rounded-full" role="status" aria-label="branching">
                            <span class="sr-only">Branching...</span>
                          </div>
                     </div>
               </div>
            </div>
          </div>
        </div>
         <div v-if="isSending" class="flex justify-center items-center opacity-75">
             <div class="animate-spin inline-block size-5 border-[3px] border-current border-t-transparent text-cyan-600 rounded-full dark:text-cyan-500" role="status" aria-label="sending"></div>
             <span class="ml-2 text-sm text-neutral-600 dark:text-neutral-400">Получение ответа от LLM...</span>
         </div>
      </div>

      <div class="p-4 md:p-6 lg:p-8 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 sticky bottom-0">
        <ChatInput
          :available-models="availableModels"
          :is-disabled="isSending"
          v-model:selectedModelId="selectedModelId"
          @send="handleSendMessage"
        />
      </div>
    </div>
     <div v-else class="flex justify-center items-center flex-grow text-neutral-500 dark:text-neutral-400">
       <p>Не удалось загрузить чат.</p>
    </div>
  </div>
</template>

<style>
.prose {
  /* Стили по умолчанию для Markdown */
}
.dark .prose-invert {
  /* Стили для Markdown в темной теме */
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}

.scroll-smooth {
  scroll-behavior: smooth;
}

[aria-label="loading"], [aria-label="sending"] {
    user-select: none;
}
</style>