const UseUserStore = defineStore("user", () => {
    const initDataUnsafe = ref();
    const isTg = computed(() => { return !!initDataUnsafe.value })

    const user = ref(null)

    return {};
});