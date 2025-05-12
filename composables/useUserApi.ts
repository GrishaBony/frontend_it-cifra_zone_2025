import type { UserDto as AdminUserDto } from "~/types/adminUserDto";
import type { UpdateUserDto } from "~/types/updateUserDto";

export function useUserApi() {
  const { $api } = useNuxtApp()

  const getAll = async () => {
    try {
        const res = await $api.get<AdminUserDto[]>(`/users`)
        return res.data;
    } catch {
        push.error({
            title: `Ошибка`,
            message: 'Не удалось получить список пользователей.',
        });
    }
  }

  const deleteMe = async () => {
    try {
        await $api.delete(`/users/me`);
        push.success({
            title: `Успешно`,
            message: 'Вы удалили свой профиль.',
        });
    } catch (error) {
        push.error({
            title: `Ошибка`,
            message: 'Не удалось удалить ваш профиль.',
        });
    }
  }

  const deleteUserById = async (userId: number) => {
    try {
        await $api.delete(`/users/${userId}`);
        push.success({
          title: `Успешно`,
          message: 'Пользователь удален.',
      });
    } catch (error) {
        push.error({
            title: `Ошибка`,
            message: 'Не удалось удалить пользователя.',
        });
    }
  }

  const updateUserById = async (id: string, body: Partial<UpdateUserDto>) => {
    try {
        await $api.patch(`/users/${id}`, body)
        push.success({
          title: `Успешно`,
          message: 'Пользователь обновлён.',
      });
    } catch (error) {
        push.error({
            title: `Ошибка`,
            message: 'Не удалось обновить пользователя.',
        });
    }
  }

  const updateMe = async (body: Partial<UpdateUserDto>) => {
    try {
        await $api.patch(`/users/me`, body)
        push.success({
          title: `Успешно`,
          message: 'Ваш профиль обновлён.',
      });
    } catch (error) {
        push.error({
            title: `Ошибка`,
            message: 'Не удалось обновить ваш профиль..',
        });
    }
  }

  return { getAll, deleteMe, deleteUserById, updateMe, updateUserById }
}
