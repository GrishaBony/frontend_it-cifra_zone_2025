<template>
  <transition name="fade">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-neutral-900/75">
      <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-11/12 max-w-md mx-auto p-6">
        <div class="flex items-center space-x-3">
          <Icon :name="iconName" size="18r" class="text-red-600 dark:text-red-400" />
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {{ title }}
          </h2>
        </div>
        <p class="mt-4 text-gray-600 dark:text-neutral-300">
          {{ message }}
        </p>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="onCancel"
            class="px-4 py-2 text-black dark:text-white bg-gray-100 dark:bg-neutral-700 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-600 transition"
          >
            Cancel
          </button>
          <button
            @click="onConfirm"
            class="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Вы уверены что хотите удалить этот элемент?'
  },
  message: {
    type: String,
    default: 'Это действие нельзя будет отменить.'
  },
  iconName: {
    type: String,
    default: 'bi:exclamation-triangle-fill'
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'onConfirm', 'onCancel'])

const visible = ref(props.modelValue)

watch(() => props.modelValue, val => {
  visible.value = val
})

function close() {
  emit('update:modelValue', false)
}

function onConfirm() {
  emit('onConfirm')
  close()
}

function onCancel() {
  emit('onCancel')
  close()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
  