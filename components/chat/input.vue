<template>
  <div class="relative">
    <textarea
      ref="textareaRef"
      v-model="inputText"
      :disabled="isDisabled"
      class="custom-scrollbar p-3 sm:p-4 pb-16 sm:pb-16 block w-full bg-gray-100 border-gray-200 rounded-lg text-sm sm:text-base focus:border-cyan-500 focus:ring-cyan-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 dark:focus:border-neutral-600 resize-none overflow-hidden"
      placeholder="Спросите что-нибуть..."
      rows="1"
      @input="adjustTextareaHeight"
      @keydown.enter.prevent="handleEnterKey"
    ></textarea>

    <div class="absolute bottom-px inset-x-px p-2 rounded-b-lg bg-gray-100 dark:bg-neutral-800">
      <div class="flex flex-wrap justify-between items-center gap-2">

        <div class="flex items-center gap-x-2">
          <div class="hs-dropdown relative inline-flex [--placement:top-left]">
             <button
                id="hs-model-select-dropdown"
                type="button"
                :disabled="isDisabled || !availableModels.length"
                class="hs-dropdown-toggle inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 px-3 py-1.5"
              >
               <Icon name="ph:brain-duotone" class="size-4 text-cyan-600 dark:text-cyan-400" />
                <span class="truncate max-w-[100px] sm:max-w-[150px]"> {{ selectedModelName }}</span>
                <svg class="hs-dropdown-open:rotate-180 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>

              <div class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-48 bg-white shadow-md rounded-lg p-2 mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700 z-20 max-h-60 overflow-y-auto custom-scrollbar" aria-labelledby="hs-model-select-dropdown">
                <button
                    v-for="model in availableModels"
                    :key="model.id"
                    @click="selectModel(model.id)"
                    class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 w-full text-left"
                    :class="{ 'bg-gray-100 dark:bg-neutral-700': model.id === selectedModelId }"
                  >
                   {{ model.displayName }}
                   <span v-if="model.isFree" class="ml-auto text-xs text-green-600 dark:text-green-400">(free)</span>
                   <span v-else-if="model.pricePerMToken" class="ml-auto text-xs text-orange-600 dark:text-orange-400">(${{ (model.pricePerMToken / 10000).toFixed(2) }}/M)</span> </button>
                 <div v-if="!availableModels.length" class="px-3 py-2 text-sm text-gray-500 dark:text-neutral-500">Нет доступных моделей</div>
              </div>
            </div>

          </div>

        <div class="flex items-center gap-x-1">
          <button
            type="button"
            @click="sendMessage"
            :disabled="isDisabled || !inputText.trim() || !selectedModelId"
            class="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-white bg-cyan-600 hover:bg-cyan-500 focus:z-10 focus:outline-none focus:bg-cyan-500 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Icon name="bi:arrow-up-square-fill" size="18" />
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue';
import type { AIModelDto } from '~/types/AIModelDto';

const props = defineProps<{
  availableModels: AIModelDto[];
  isDisabled?: boolean;
  selectedModelId: number | null;
}>();

const emit = defineEmits<{
  (e: 'send', payload: { content: string; modelId: number | null }): void;
  (e: 'update:selectedModelId', value: number | null): void; 
}>();

const inputText = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const selectedModelName = computed(() => {
  const model = props.availableModels.find(m => m.id === props.selectedModelId);
  return model ? model.displayName : 'Выберите модель';
});

const adjustTextareaHeight = () => {
  nextTick(() => { 
    const textarea = textareaRef.value;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 200;
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  });
};

const selectModel = (modelId: number) => {
    emit('update:selectedModelId', modelId);
    // Close dropdown manually if not using Preline JS or if it doesn't close automatically
    // const dropdownElement = document.getElementById('hs-model-select-dropdown');
    // if (dropdownElement && HSBase) HSBase.getInstance(dropdownElement).close();
};


const sendMessage = () => {
  if (!inputText.value.trim() || props.isDisabled || !props.selectedModelId) return;
  emit('send', { content: inputText.value, modelId: props.selectedModelId });
  inputText.value = ''; 
  adjustTextareaHeight();
};

const handleEnterKey = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
  // Shift+Enter
};


watch(inputText, adjustTextareaHeight);

onMounted(() => {
  adjustTextareaHeight();
   // Initialize Preline dropdown component if needed
   // Make sure Preline's base JS is loaded
  // setTimeout(() => { // Delay slightly for elements to be ready
  //   HSBase.reinit(); // Or specifically HSdropdown.reinit()
  // }, 100);
});

</script>

<style scoped>
textarea {
  line-height: 1.5;
  min-height: 40px;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>