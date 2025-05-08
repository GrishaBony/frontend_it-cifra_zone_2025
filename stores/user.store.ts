import type { User } from "~/types/userDto";

export const useUserStore = defineStore("user", () => {
    const initDataUnsafe = ref();
    const isTg = computed(() => { return !!initDataUnsafe.value?.user || null })

    const user = ref<User | null>(null)
    const isFirstLaunch = ref(false)


    return { initDataUnsafe, isTg, user, isFirstLaunch };
});