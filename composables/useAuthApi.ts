import type { UserDto } from '~/types/userDto'

export function useAuthApi() {
const { $api } = useNuxtApp()   

const login = async (initData: string) => {
    try {
        const res = await $api.post<UserDto>(`/auth/tg`, { initData })
        return res.data;
    } catch {
        push.error({
            title: `Ошибка`,
            message: 'Не удалось авторизоваться. Пожалуйста попробуйте позже.',
        });
    }
};
    

//   const updateUser = async (id: string, body: Partial<UserDto>) => {
//     const { data } = await $api.put<UserDto>(`/users/${id}`, body)
//     return data
//   }

  return { login }
}
