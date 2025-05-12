<script setup lang="ts">
import ConfirmationModal from '~/components/modals/ConfirmationModal.vue';
import type { AIModelDto } from '~/types/AIModelDto';
import type { AllAIModelDto } from '~/types/AllAIModelDto';
import { Role } from '~/types/Role.enum';

definePageMeta({
  layout: 'admin-layout',
  middleware: ['auth'],
  role: [Role.ADMIN]
});

const aiApi = useAIModelApi();

const fastAnswerModel = ref<string | undefined>();
const aiModels = ref<AIModelDto[] | undefined>();
const allAIModels = ref<AllAIModelDto[] | undefined>();

const isChangeFastAnswerModelModalOpen = ref(false);
const isAddModelModalOpen = ref(false);

const newModelForm = ref<{
  selectedBaseModelId: string | null;
  originalData: {
    modelId: string;
    displayName: string;
    description: string | null;
    canRecognizeImages: boolean;
    maxContextLength: number;
  } | null;
  editableDisplayName: string;
  editableDescription: string | null;
  editableMaxContextLength: number;

  isFree: boolean;
  pricePerMToken: number;
}>({
  selectedBaseModelId: null,
  originalData: null,
  editableDisplayName: '',
  editableDescription: null,
  editableMaxContextLength: 0,
  isFree: false,
  pricePerMToken: 0,
});


const selectedNewFastAnswerModelId = ref<string | undefined>();

onMounted(async () => {
  await fetchData();
});

const fetchData = async () => {
  fastAnswerModel.value = await aiApi.getFastAnswerAIModel();
  aiModels.value = await aiApi.getAIModels();
  allAIModels.value = await aiApi.getAllAIModels();
  selectedNewFastAnswerModelId.value = fastAnswerModel.value;
};

const handleBaseModelSelectionChange = () => {
  const selectedBase = allAIModels.value?.find(m => m.modelId === newModelForm.value.selectedBaseModelId);
  if (selectedBase) {
    newModelForm.value.originalData = {
      modelId: selectedBase.modelId,
      displayName: selectedBase.displayName,
      description: selectedBase.description,
      canRecognizeImages: selectedBase.canRecognizeImages,
      maxContextLength: selectedBase.maxContextLength,
    };
    newModelForm.value.editableDisplayName = selectedBase.displayName;
    newModelForm.value.editableDescription = selectedBase.description;
    newModelForm.value.editableMaxContextLength = selectedBase.maxContextLength;

    newModelForm.value.isFree = false;
    newModelForm.value.pricePerMToken = 0;
  } else {
    resetNewModelForm();
  }
};

watch(() => newModelForm.value.isFree, (isFree) => {
  if (isFree) {
    newModelForm.value.pricePerMToken = 0;
  }
});

const saveNewFastAnswerModel = async () => {
  if (selectedNewFastAnswerModelId.value) {
    await aiApi.setFastAnswerAIModel(selectedNewFastAnswerModelId.value);
    fastAnswerModel.value = selectedNewFastAnswerModelId.value;
    isChangeFastAnswerModelModalOpen.value = false;
  }
};

const saveNewAIModel = async () => {
  if (!newModelForm.value.originalData || !newModelForm.value.editableDisplayName) {
    push.info('Укажите отображаемое имя.');
    return;
  }

  if (newModelForm.value.editableMaxContextLength > newModelForm.value.originalData.maxContextLength) {
    push.info(`Максимальная длина контекста не может превышать исходное значение: ${newModelForm.value.originalData.maxContextLength}.`);
    return;
  }
  if (newModelForm.value.editableMaxContextLength < 0 || newModelForm.value.editableMaxContextLength === 0) {
    push.info(`Максимальная длина контекста не может быть отрицательной или равной нулю.`);
    return;
  }


  const modelToAdd: Omit<AIModelDto, 'id' | 'createdAt'> = {
    modelId: newModelForm.value.originalData.modelId, // Non-editable
    displayName: newModelForm.value.editableDisplayName,
    description: newModelForm.value.editableDescription,
    isFree: newModelForm.value.isFree,
    pricePerMToken: Number(newModelForm.value.pricePerMToken),
    canRecognizeImages: newModelForm.value.originalData.canRecognizeImages, // Non-editable
    maxContextLength: Number(newModelForm.value.editableMaxContextLength),
  };
  await aiApi.addAIModel(modelToAdd);

  await fetchData();
  isAddModelModalOpen.value = false;
  resetNewModelForm();
};

const resetNewModelForm = () => {
  newModelForm.value = {
    selectedBaseModelId: null,
    originalData: null,
    editableDisplayName: '',
    editableDescription: null,
    editableMaxContextLength: 0,
    isFree: false,
    pricePerMToken: 0,
  };
};

const openChangeFastAnswerModelModal = () => {
  selectedNewFastAnswerModelId.value = fastAnswerModel.value;
  isChangeFastAnswerModelModalOpen.value = true;
};

const openAddModelModal = () => {
  resetNewModelForm();
  isAddModelModalOpen.value = true;
};

const formatDate = (date: Date | string | undefined) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const showDeleteModel = ref(false);
const deleteModelId = ref('');

const deleteModel = (modelId: string) => {
  showDeleteModel.value = true;
  deleteModelId.value = modelId;
}

const confirmDeleteModel = async () => {
  await aiApi.daleteAIModel(deleteModelId.value)
  showDeleteModel.value = false;
  fetchData();
} 

const apiKey = ref('sk-or-v1-aaaaaaaabbbbbbbbccccccccddddddddeeeeeeeeffffffffgggggggg00000000')
const showApiKeyConfirm = ref(false);

const confirmUpdateApiKey = async () => {
  if (apiKey.value === 'sk-or-v1-aaaaaaaabbbbbbbbccccccccddddddddeeeeeeeeffffffffgggggggg00000000' || apiKey.value.trim() == '') {
    push.info({
      title: `Внимание`,
      message: 'Укажите корректный API-Ключ.',
    });
  } else {
    await useAIModelApi().setApiKey(apiKey.value);
  }
}

</script>

<template>
  <ConfirmationModal
      v-model="showDeleteModel"
      title="Вы уверены, что хотите удалить эту модель?"
      message="Это дествие нельзя будет отменить. Вместе с моделью удалятся все чаты пользователей, где она была использована!"
      @onConfirm="confirmDeleteModel"
  />

  <ConfirmationModal
    v-model="showApiKeyConfirm"
    title="Вы уверены, что хотите изменить API-Ключ?"
    message="Это дествие нельзя будет отменить. Текущий ключ будет заменён новым."
    @onConfirm="confirmUpdateApiKey"
    />

  <div class="p-4 md:p-6 lg:p-8 min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
    <section class="mb-10">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <h1 class="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">Конфигурация OpenRouter</h1>
      </div>
      <div class="flex flex-col gap-4 bg-white dark:bg-neutral-800 shadow-lg rounded-xl p-6">
        <div class="flex items-center gap-4">
          <h2 class="font-bold">API-Ключ</h2>
          <input type="password" v-model="apiKey" class="flex-1 py-1.5 sm:py-2 px-3 block border-gray-200 rounded-lg sm:text-sm focus:border-gray-500 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="sk-or-v1-.....................">
        </div>
        <button @click="showApiKeyConfirm = true" class="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800">
          Изменить
        </button>
      </div>
    </section>

    <section class="mb-10">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <h1 class="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">Модель для быстрого ответа</h1>
        <button @click="openChangeFastAnswerModelModal"
          class="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800">
          Изменить модель
        </button>
      </div>
      <div class="bg-white dark:bg-neutral-800 shadow-lg rounded-xl p-6">
        <p v-if="fastAnswerModel" class="text-base sm:text-lg text-neutral-700 dark:text-neutral-300">
          Текущая: <span class="font-semibold text-blue-600 dark:text-blue-400">{{ allAIModels?.find(m => m.modelId === fastAnswerModel)?.displayName || fastAnswerModel }}</span>
          <span v-if="allAIModels?.find(m => m.modelId === fastAnswerModel)?.displayName" class="text-xs text-neutral-500 dark:text-neutral-400"> ({{ fastAnswerModel }})</span>
        </p>
        <p v-else class="text-base sm:text-lg text-neutral-500 dark:text-neutral-400">Модель для быстрого ответа не установлена.</p>
      </div>
    </section>

    <section>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
        <h1 class="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">Сконфигурированные Модели</h1>
        <button @click="openAddModelModal"
          class="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800">
          Добавить модель
        </button>
      </div>
      <div v-if="aiModels === undefined" class="text-center py-10">
         <div class="animate-spin inline-block size-8 border-[3px] border-current border-t-transparent text-gray-600 rounded-full" role="status" aria-label="loading">
          <span class="sr-only">Loading...</span>
        </div>
        <p class="mt-2 text-neutral-600 dark:text-neutral-400">Загрузка моделей...</p>
      </div>
      <div v-else-if="aiModels && aiModels.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="model in aiModels" :key="model.id"
          class="bg-white dark:bg-neutral-800 shadow-xl rounded-xl p-5 sm:p-6 flex flex-col transition-shadow duration-300 hover:shadow-2xl">
          <div class="flex-grow">
            <div class="flex justify-between">
              <div>
                <h2 class="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{{ model.displayName }}</h2>
                <p class="text-xs text-neutral-500 dark:text-neutral-400 mb-3">ID: {{ model.modelId }}</p>
              </div>
              <button @click="() => deleteModel(model.id)" class="flext items-center justify-center h-8 w-8 rounded-xl bg-red-700 hover:bg-red-900">
                <Icon name="bi:trash2-fill" size="16" />
              </button>
            </div>
            <p class="text-sm text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-3" :title="model.description || ''">
              {{ model.description || 'Нет описания.' }}
            </p>
            <div class="space-y-2 text-sm mb-4">
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">Распознает изображения:</span>
                  <span class="font-medium">
                    <svg v-if="model.canRecognizeImages" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5 text-green-500 dark:text-green-400">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.06 0l4.002-5.5a.25.25 0 0 0 .04-.025Z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5 text-red-500 dark:text-red-400">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clip-rule="evenodd" />
                    </svg>
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">Макс. контекст:</span>
                <span class="font-medium text-neutral-800 dark:text-neutral-100">{{ model.maxContextLength.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">Бесплатная:</span>
                  <span
                  :class="model.isFree ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-200' : 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-200'"
                  class="px-2.5 py-1 rounded-full text-xs font-semibold">
                  {{ model.isFree ? 'Да' : 'Нет' }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">Цена (1M токенов):</span>
                <span class="font-medium text-neutral-800 dark:text-neutral-100">{{ model.pricePerMToken.toFixed(2) }} ₽</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-neutral-600 dark:text-neutral-400">Добавлена:</span>
                <span class="font-medium text-neutral-800 dark:text-neutral-100">{{ formatDate(model.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-10">
        <svg class="mx-auto size-12 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
        </svg>
        <p class="mt-4 text-lg text-neutral-500 dark:text-neutral-400">Модели еще не добавлены.</p>
        <p class="text-sm text-neutral-400 dark:text-neutral-500">Нажмите "Добавить модель", чтобы начать.</p>
      </div>
    </section>

    <div v-if="isChangeFastAnswerModelModalOpen"
      class="fixed inset-0 z-[70] bg-neutral-900 bg-opacity-60 dark:bg-opacity-75 flex justify-center items-center p-4 transition-opacity duration-300">
      <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-modalShow">
        <div class="py-3.5 px-5 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700">
          <h3 class="font-semibold text-lg text-neutral-800 dark:text-neutral-100">
            Изменить модель для быстрого ответа
          </h3>
          <button @click="isChangeFastAnswerModelModalOpen = false" type="button"
            class="flex justify-center items-center size-8 text-sm font-semibold rounded-full border border-transparent text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-600">
            <span class="sr-only">Close</span>
            <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>
        <div class="p-5 space-y-4">
          <label for="fastAnswerModelSelect" class="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Выберите модель из всех доступных:</label>
          <select id="fastAnswerModelSelect" v-model="selectedNewFastAnswerModelId"
            class="py-3 px-4 block w-full border-neutral-300 dark:border-neutral-600 rounded-lg text-sm text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-700 focus:border-neutral-500 focus:ring-neutral-500 dark:focus:border-neutral-500 dark:focus:ring-neutral-500 disabled:opacity-50 disabled:pointer-events-none">
            <option :value="undefined">-- Не выбрано --</option>
            <option v-for="model in allAIModels" :key="model.modelId" :value="model.modelId">
              {{ model.displayName }} ({{ model.modelId }})
            </option>
          </select>
        </div>
        <div class="flex justify-end items-center gap-x-3 py-3.5 px-5 border-t border-neutral-200 dark:border-neutral-700">
          <button @click="isChangeFastAnswerModelModalOpen = false" type="button"
            class="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-neutral-300 bg-white text-neutral-800 shadow-sm hover:bg-neutral-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500">
            Отмена
          </button>
          <button @click="saveNewFastAnswerModel" type="button"
            class="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-gray-500">
            Сохранить
          </button>
        </div>
      </div>
    </div>

    <div v-if="isAddModelModalOpen"
      class="fixed inset-0 z-[70] bg-neutral-900 bg-opacity-60 dark:bg-opacity-75 flex justify-center items-start md:items-center p-4 transition-opacity duration-300 overflow-y-auto">
      <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-xl my-auto transform transition-all duration-300 scale-95 opacity-0 animate-modalShow">
        <div class="py-3.5 px-5 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700">
          <h3 class="font-semibold text-lg text-neutral-800 dark:text-neutral-100">
            Добавить новую AI модель
          </h3>
          <button @click="isAddModelModalOpen = false" type="button"
            class="flex justify-center items-center size-8 text-sm font-semibold rounded-full border border-transparent text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-600">
            <span class="sr-only">Close</span>
            <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>
        <div class="p-5 space-y-5 max-h-[70vh] md:max-h-[65vh] overflow-y-auto custom-scrollbar">
          <div>
            <label for="baseModelSelect" class="block text-sm font-medium mb-1.5 text-neutral-700 dark:text-neutral-300">1. Выберите базовую модель</label>
            <select id="baseModelSelect" v-model="newModelForm.selectedBaseModelId" @change="handleBaseModelSelectionChange"
              class="py-3 px-4 block w-full border-neutral-300 dark:border-neutral-600 rounded-lg text-sm text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-700 focus:border-neutral-500 focus:ring-neutral-500 dark:focus:border-neutral-500 dark:focus:ring-neutral-500 disabled:opacity-50 disabled:pointer-events-none">
              <option disabled :value="null">-- Выберите из доступных --</option>
              <option v-for="model in allAIModels" :key="model.modelId" :value="model.modelId">
                {{ model.displayName }}
              </option>
            </select>
          </div>

          <div v-if="newModelForm.originalData" class="space-y-4 pt-2 border-t border-neutral-200 dark:border-neutral-700">
            <p class="text-sm font-medium text-neutral-700 dark:text-neutral-300">2. Сконфигурируйте параметры модели</p>
            <div>
                <p class="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Model ID (нередактируемый)</p>
                <p class="text-sm p-2 bg-neutral-100 dark:bg-neutral-700 rounded-md text-neutral-600 dark:text-neutral-300">{{ newModelForm.originalData.modelId }}</p>
            </div>
            <div>
              <label for="editableDisplayName" class="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Отображаемое имя</label>
              <input type="text" id="editableDisplayName" v-model="newModelForm.editableDisplayName"
                class="py-2.5 px-3 block w-full border-neutral-300 dark:border-neutral-600 rounded-lg text-sm text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-700 focus:border-neutral-500 focus:ring-neutral-500 dark:focus:border-neutral-500 dark:focus:ring-neutral-500">
            </div>

            <div>
              <label for="editableDescription" class="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Описание</label>
              <textarea id="editableDescription" v-model="newModelForm.editableDescription" rows="3"
                class="custom-scrollbar py-2.5 px-3 h-48 block w-full border-neutral-300 dark:border-neutral-600 rounded-lg text-sm text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-700 focus:border-neutral-500 focus:ring-neutral-500 dark:focus:border-neutral-500 dark:focus:ring-neutral-500"></textarea>
            </div>
             <div>
              <label for="editableMaxContextLength" class="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Макс. длина контекста</label>
              <input type="number" id="editableMaxContextLength" v-model.number="newModelForm.editableMaxContextLength" :max="newModelForm.originalData.maxContextLength" min="0"
                class="py-2.5 px-3 block w-full border-neutral-300 dark:border-neutral-600 rounded-lg text-sm text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-700 focus:border-neutral-500 focus:ring-neutral-500 dark:focus:border-neutral-500 dark:focus:ring-neutral-500">
                <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Исходное значение: {{ newModelForm.originalData.maxContextLength }}. Не может быть больше исходного.</p>
            </div>

            <div class="flex items-center gap-x-3">
                <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">Распознает изображения:</span>
                <span class="font-medium">
                    <svg v-if="newModelForm.originalData.canRecognizeImages" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-6 text-green-600 dark:text-green-500">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.06 0l4.002-5.5a.25.25 0 0 0 .04-.025Z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-6 text-red-600 dark:text-red-500">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clip-rule="evenodd" />
                    </svg>
                </span>
            </div>
            <hr class="my-4 border-neutral-200 dark:border-neutral-700"/>
             <div>
                <label class="flex items-center gap-x-2 text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer">
                    <input type="checkbox" v-model="newModelForm.isFree"
                        class="shrink-0 mt-0.5 border-neutral-300 dark:border-neutral-600 rounded text-blue-600 focus:ring-blue-500 dark:focus:ring-offset-neutral-800 disabled:opacity-50 disabled:pointer-events-none">
                    Это бесплатная модель?
                </label>
            </div>

            <div>
              <label for="pricePerMToken" class="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Цена за 1М токенов (₽)</label>
              <input type="number" id="pricePerMToken" v-model.number="newModelForm.pricePerMToken" :disabled="newModelForm.isFree"
                min="0" step="0.01"
                class="py-2.5 px-3 block w-full border-neutral-300 dark:border-neutral-600 rounded-lg text-sm text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-700 focus:border-neutral-500 focus:ring-neutral-500 dark:focus:border-neutral-500 dark:focus:ring-neutral-500"
                :class="{'bg-neutral-100 dark:bg-neutral-700 cursor-not-allowed opacity-70': newModelForm.isFree}">
                <p v-if="newModelForm.isFree" class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Цена не указывается для бесплатных моделей.</p>
            </div>
          </div>
          <div v-else class="text-center py-6">
            <svg class="mx-auto size-10 text-neutral-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <p class="mt-2 text-neutral-500 dark:text-neutral-400">Выберите базовую модель, чтобы настроить ее параметры.</p>
          </div>
        </div>
        <div class="flex justify-end items-center gap-x-3 py-3.5 px-5 border-t border-neutral-200 dark:border-neutral-700">
          <button @click="isAddModelModalOpen = false" type="button"
            class="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-neutral-300 bg-white text-neutral-800 shadow-sm hover:bg-neutral-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500">
            Отмена
          </button>
          <button @click="saveNewAIModel" type="button" :disabled="!newModelForm.originalData"
            class="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-cyan-500">
            Сохранить модель
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>

@keyframes modalShow {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.animate-modalShow {
  animation: modalShow 0.3s ease-out forwards;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Убираем кнопки инпутов для чисел */
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style>