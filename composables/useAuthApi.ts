import type { User, UserDto } from '~/types/userDto'

export function useAuthApi() {
const { $api } = useNuxtApp()   

const login = async (initData: string) => {
    try {
        const res = await $api.post<UserDto>(`/auth/tg`, { initData })
        return res.data;
    } catch {
        return null;
    }
};

const register = async (initData: string) => {
    try {
        const res = await $api.post<User>(`/auth/tg/register`, { initData })
        return res.data;
    } catch {
        push.error({
            title: `Ошибка`,
            message: 'Не удалось зарегистрировать пользователя. Пожалуйста попробуйте позже.',
        });
    }
}


const getMe = async () => {
    try {
        const res = await $api.get<User>(`/users/me`)
        return res.data;
    } catch {
        push.error({
            title: `Ошибка`,
            message: 'Не удалось получить информацию о пользователе. Пожалуйста перезайдите в mini-app.',
        });
    }
}

  return { login, register, getMe }
}
