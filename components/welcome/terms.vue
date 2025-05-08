<script setup lang="ts">
defineEmits(['next'])
</script>

<template>
    <div>
        <h1 class="text-[clamp(1.5rem,5vw,1.875rem)] font-bold text-gray-900 dark:text-white mb-4">Пользовательское соглашение</h1>

        <div class="text-gray-600 dark:text-gray-300 text-sm text-left overflow-y-auto custom-scrollbar pr-2 flex-grow h-36">
              <p class="mb-3">
                Пожалуйста, внимательно ознакомьтесь с условиями использования нашего сервиса.
              </p>
              <p class="mb-2">
                Это пример текста пользовательского соглашения.
                Он содержит основные положения, регулирующие ваше взаимодействие с нашим приложением.
                <br><br>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
               <p class="mb-2">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Дальнейшее использование приложения означает ваше полное согласие со всеми пунктами, изложенными ниже и по ссылкам.
              </p>
        </div>
    
        <hr class="my-4 border-gray-300">
        <p class="text-gray-600 dark:text-gray-400 text-xs mb-6">
          Нажимая кнопку "Продолжить", вы подтверждаете свое согласие с
          <a href="/terms" target="_blank" class="text-cyan-600 hover:underline">Пользовательским соглашением</a> и
          <a href="/privacy" target="_blank" class="text-cyan-600 hover:underline">Политикой обработки персональных данных</a>.
        </p>
    
        <button
          @click="$emit('next')"
          class="w-full py-3 px-6 rounded-lg text-lg font-semibold bg-cyan-600 text-white hover:bg-cyan-700 focus:outline-none active:bg-cyan-500 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
        >
          Продолжить
        </button>
    </div>
</template>