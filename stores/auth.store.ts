export const useAuthStore = defineStore("auth", () => {
    const userStore = useUserStore();

    const isLoggedIn = ref<boolean>(false)

    const login = async (initData: string) => {
        const user = await useAuthApi().login(initData);
        if (user && 'userExists' in user) {
            if (user.userExists === false) {
                isLoggedIn.value = false;
                userStore.isFirstLaunch = true;
                return false;
            } 
        } else if (user) {
            isLoggedIn.value = true;
            userStore.isFirstLaunch = false;
            userStore.user = user;
            return true;
        } else {
            push.error({
                title: `Ошибка`,
                message: 'Не удалось авторизоваться. Пожалуйста попробуйте позже.',
            });
        }
    }

    const register = async (initData: string) => {
        const user = await useAuthApi().register(initData);
        if (user) {
            userStore.user = user;
            isLoggedIn.value = true;
        }
    }


    return { isLoggedIn, login, register };
});