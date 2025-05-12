import type { AIModelDto } from "~/types/AIModelDto";
import type { AllAIModelDto } from "~/types/AllAIModelDto";

export function useAIModelApi() {
  const { $api } = useNuxtApp()

  const getAllAIModels = async () => {
    try {
        const res = await $api.get<AllAIModelDto[]>(`/ai-models/all`)
        return res.data;
    } catch {
        push.error({
            title: `Ошибка`,
            message: 'Не удалось получить список доступных моделей.',
        });
    }
  }

  const getAIModels = async () => {
    try {
        const res = await $api.get<AIModelDto[]>(`/ai-models`)
        return res.data;
    } catch {
        push.error({
            title: `Ошибка`,
            message: 'Не удалось получить список доступных моделей.',
        });
    }
  }

  const getFastAnswerAIModel = async () => {
    try {
        const res = await $api.get<string>(`/ai-models/fast-answer`)
        return res.data;
    } catch {
        push.error({
            title: `Ошибка`,
            message: 'Не удалось получить список доступных моделей.',
        });
    }
  }

  const setFastAnswerAIModel = async (modelId: string) => {
    try {
        await $api.post(`/ai-models/fast-answer`, { model: modelId})
        push.success({
            title: `Успешно`,
            message: 'Модель успешно добавлена.',
        });
    } catch (error) {
        push.error({
            title: `Ошибка`,
            message: 'Не удалось добавить модель.',
        });
    }
  }

  const addAIModel = async (body: Omit<AIModelDto, "id" | "createdAt">) => {
    try {
      await $api.post(`/ai-models`, body)
      push.success({
        title: `Успешно`,
        message: 'Модель успешно добавлена.',
      });
    } catch (error) {
      push.error({
        title: `Ошибка`,
        message: 'Не удалось добавить модель.',
      });
    }
  }

  const daleteAIModel = async (id: string) => {
    try {
      await $api.delete(`/ai-models/${id}`)
      push.info({
        title: `Успешно`,
        message: 'Модель успешно удалена.',
      });
    } catch (error) {
      push.error({
        title: `Ошибка`,
        message: 'Не удалось удалить модель.',
      });
    }
  }

  const setApiKey = async (apiKey: string) => {
    try {
      await $api.put(`/ai-models/api-key`, { apiKey: apiKey })
      push.success({
        title: `Успешно`,
        message: 'API-Ключ успешно установлен.',
      });
    } catch (error) {
      push.error({
        title: `Ошибка`,
        message: 'Не удалось установить API-Ключ.',
      });
    }
  }


  return { getAllAIModels, getAIModels, getFastAnswerAIModel, setFastAnswerAIModel, addAIModel, daleteAIModel, setApiKey }
}
