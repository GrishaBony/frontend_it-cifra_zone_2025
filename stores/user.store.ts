export const UseUserStore = defineStore("user", () => {
    const initDataUnsafe = ref();
    const isTg = computed(() => { return !!initDataUnsafe.user })

    const user = ref(null)
    const isFirstLaunch = ref(false)


    return { initDataUnsafe, isTg, user, isFirstLaunch };
});