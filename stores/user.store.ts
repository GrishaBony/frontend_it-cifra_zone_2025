import type { UserSigned } from "~/types/userDto";

export const useUserStore = defineStore("user", () => {
    const initDataUnsafe = ref();
    const isTg = computed(() => { return !!initDataUnsafe.value?.user || null })

    const user = ref<UserSigned | null>(null)
    const isFirstLaunch = ref(false)


    return { initDataUnsafe, isTg, user, isFirstLaunch };
});