import type { UserDto } from "~/types/userDto";

export function useSupportApi() {
  const { $api } = useNuxtApp()

  const getAll = async () => {
    try {
        const res = await $api.get<{
          id: number;
          type: 'BUG_REPORT' | 'OTHER' | null;
          theme: string | null;
          description: string | null;
          finished: boolean;
          userId: number;
          user: UserDto;
        }[]>(`/support/tickets`)
        return res.data;
    } catch {
        push.error({
            title: `Ошибка`,
            message: 'Не удалось получить список тикетов.',
        });
    }
  }

  return { getAll }
}
