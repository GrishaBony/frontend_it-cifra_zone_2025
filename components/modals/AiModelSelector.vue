<template>
    <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Cards for current models -->
      <div
        v-for="model in aiModels"
        :key="model.id"
        class="bg-white rounded-2xl shadow p-4 flex flex-col justify-between"
      >
        <div>
          <h3 class="text-xl font-semibold mb-2">{{ model.displayName }}</h3>
          <p class="text-gray-500 text-sm mb-4">
            {{ model.description || 'Без описания' }}
          </p>
        </div>
        <div class="flex items-center justify-between">
          <div class="space-x-2">
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="model.isFree ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'"
            >
              {{ model.isFree ? 'Free' : formatPrice(model.pricePerMToken) }}
            </span>
            <span class="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
              {{ model.maxContextLength }} tokens
            </span>
          </div>
          <!-- Quick-response change button appears only on the quick model card -->
          <button
            v-if="isQuickModel(model)"
            @click="openModal = true"
            class="text-blue-600 hover:text-blue-800"
            title="Изменить модель быстрого ответа"
          >
            +
          </button>
        </div>
      </div>
    </div>
  
    <!-- Modal -->
    <div
      v-if="openModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-auto p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold">Выберите модель быстрого ответа</h2>
          <button @click="openModal = false" class="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="option in allModels"
            :key="option.modelId"
            class="border rounded-xl p-4 hover:shadow-lg transition cursor-pointer"
            @click="selectQuickModel(option.modelId)"
          >
            <h3 class="font-medium mb-1">{{ option.displayName }}</h3>
            <p class="text-gray-500 text-sm mb-2">
              {{ shorten(option.description) }}
            </p>
            <div class="text-xs text-gray-400">
              Модальность: {{ option.modality }} | Длина: {{ option.maxContextLength }}
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button
            @click="openModal = false"
            class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  // Props: текущие модели и все доступные модели
  const props = defineProps({
    aiModels: {
      type: Array,
      required: true,
    },
    allModels: {
      type: Array,
      required: true,
    },
    quickModelId: {
      type: String,
      required: true,
    },
  });
  const emit = defineEmits(['update:quickModelId']);
  
  const openModal = ref(false);
  
  const isQuickModel = model => model.modelId === props.quickModelId;
  
  function formatPrice(price) {
    return `${price.toFixed(4)} per MToken`;
  }
  
  function shorten(text) {
    if (!text) return '';
    return text.length > 100 ? text.slice(0, 97) + '...' : text;
  }
  
  function selectQuickModel(modelId) {
    emit('update:quickModelId', modelId);
    openModal.value = false;
  }
  </script>
  
  <style scoped>
  /* Здесь можно добавить стили Preline-подобные, если необходимо */
  </style>
  