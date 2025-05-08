<script setup lang="ts">
const route = useRoute();
const initData = route.query.initData?.toString();

const authStore = useAuthStore();
const userStore = useUserStore();
const firstname = userStore.initDataUnsafe?.user?.first_name;
const lastname = userStore.initDataUnsafe?.user?.last_name;

const username = computed(() => {
    if (firstname && lastname) {
        return `${firstname} ${lastname}`;
    } else if (firstname) {
        return firstname;
    } else {
        return 'Дорогой пользователь';
    }
})

const showWelcome = ref(false);

const step = ref(1);
const isLoading = ref(false)

onMounted(() => {
  setTimeout(() => {
    showWelcome.value = true;
  }, 100)
})

const acceptTerms = async () => {
    isLoading.value = true;

    if (!initData) {
        throw createError({
        statusCode: 401,
      })
    }

    await authStore.register(initData);
    // Показываем загрузку, затем анимацию исчезновения модалки
    setTimeout(() => {
      showWelcome.value = false;
      setTimeout(() => {
        navigateTo('/newchat')
      }, 700)
    }, 1000)
}

</script>

<template>
    <div class="flex flex-col items-center min-h-screen w-full px-4 text-center">
          <Transition name="modal" appear>
            <div v-if="showWelcome" class="flex-grow flex items-center justify-center">
              <div class="transition-all duration-700 ease-out bg-white/80 dark:bg-neutral-900/80 border border-gray-200 dark:border-neutral-700 shadow-lg rounded-2xl p-6 max-w-md w-full">
                  <Transition name="step" mode="out-in">
                      <WelcomeHello :key="'wellcome'" v-if="step == 1 && !isLoading" :username="username" @next="step = 2"></WelcomeHello>
                      <WelcomeTerms :key="'terms'" v-else-if="step == 2 && !isLoading" @next="acceptTerms"></WelcomeTerms>
                      <WelcomeLoading :key="'loading'" v-else-if="isLoading"></WelcomeLoading>
                  </Transition>
              </div>
            </div>
          </Transition>
        
          <p class="m-2 mt-auto text-sm text-gray-950 dark:text-neutral-400">
           Автор: <a class="text-blue-300 hover:underline hover:text-blue-200" href="https://t.me/GrishkaRe" target="_blank">Григорий Ичетовкин</a>
           | <span class="text-blue-400 font-medium">IT-ЦИФРА.ZONE</span>
         </p>
    </div>
</template>

<style scoped>
/* Модалка */
.modal-enter-from,
.modal-appear-from {
  opacity: 0;
  transform: translateY(20px);
}
.modal-enter-active,
.modal-leave-active,
.modal-appear-active {
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.modal-enter-to,
.modal-appear-to {
  opacity: 1;
  transform: translateY(0);
}
.modal-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Шаги */
.step-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.step-enter-active,
.step-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.step-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.step-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.step-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>