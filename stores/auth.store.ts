export const useAuthStore = defineStore("auth", () => {
    const userStore = useUserStore();

    const isLoggedIn = ref<boolean>(false)

    const login = async (initData: string) => {
        const user = await useAuthApi().login(initData);
        console.log(user)
        if (user && !('auth' in user && user.auth == false)) {
            isLoggedIn.value = true;
            userStore.user = user;
        } else {
            isLoggedIn.value = false;
            userStore.isFirstLaunch = true;
            await navigateTo('/wellcome');
        }
        
    }


    return { isLoggedIn, login };
});