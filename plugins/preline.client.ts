// Preline UI
import 'preline/dist/preline';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('page:finish', () => {
      if (typeof window !== 'undefined' && window.HSStaticMethods) {
        window.HSStaticMethods.autoInit();
      }
    });
  });