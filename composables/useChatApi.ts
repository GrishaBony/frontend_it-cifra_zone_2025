import type {
  BranchChatDto,
  // CreateChatDto,
  // UpdateChatDto,
  // SendMessageDto,
  // BranchChatDto,
  ChatDto,
  ChatWithMessagesDto,
  CreateChatDto,
  UpdateChatDto,
  // ChatWithMessagesDto,
  // ParsedMessageEvent 
} from '~/types/ChatApiDto.ts';

// Функция для парсинга SSE потока из ReadableStream () (by AI)
async function* parseSseStream(reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<ParsedMessageEvent> {
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split('\n\n');
      buffer = events.pop() || '';

      for (const eventString of events) {
        if (!eventString) continue;

        const lines = eventString.split('\n');
        let eventType: string | null = null;
        let dataLines: string[] = [];

        for (const line of lines) {
          if (line.startsWith(':')) continue;

          const colonIndex = line.indexOf(':');
          if (colonIndex === -1) continue;

          const fieldName = line.substring(0, colonIndex);
          const fieldValue = line.substring(colonIndex + 1).trimStart();

          if (fieldName === 'event') {
            eventType = fieldValue;
          } else if (fieldName === 'data') {
            dataLines.push(fieldValue);
          }
        }

        if (eventType) {
          let eventData: any = undefined;
          if (dataLines.length > 0) {
            try {
              eventData = JSON.parse(dataLines.join('\n'));
            } catch (e: any) {
              console.error('Failed to parse SSE data JSON:', e, 'Raw Data:', dataLines.join('\n'));
              // Вместо пропуска, генерируем событие ошибки парсинга
              yield { type: 'error', data: { errorMessage: `Failed to parse data: ${e.message}. Raw: ${dataLines.join('\n')}` } } as ParsedMessageEvent;
              continue; // Пропускаем обработку этого события, если парсинг не удался
            }
          }
          yield { type: eventType, data: eventData } as ParsedMessageEvent;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}


export function useChatApi() {
  const { $api } = useNuxtApp();

  // Используем $api для CRUD операций
  const createChat = async (): Promise<ChatDto | undefined> => {
    try {
      const response = await $api.post('/chats');
      return response.data;
    } catch (error: any) {
      push.error({
        title: `Ошибка`,
        message: 'Не удалось создать чат. Пожалуйста, попробуйте позже.',
      });
    }
  };

  const getUserChats = async (page: number = 1, pageSize: number = 20): Promise<ChatDto[] | undefined> => {
    try {
      const params: { page?: number, pageSize?: number } = {};
      if (page) params.page = page;
      if (pageSize) params.pageSize = pageSize;
      console.log(params)

      const response = await $api.get<ChatDto[]>('/chats', {
        params: params,
      });
      return response.data;
    } catch (error: any) {
      push.error({
        title: `Ошибка`,
        message: 'Не удалось получить список чатов. Пожалуйста, попробуйте позже.',
      });
    }
  };

  const getChatById = async (chatId: string): Promise<ChatWithMessagesDto | undefined> => {
    try {
      const response = await $api.get<ChatWithMessagesDto>(`/chats/${chatId}`); // Используем $api.get
      return response.data;
    } catch (error: any) {
      push.error({
        title: `Ошибка`,
        message: 'Не удалось получить чат. Пожалуйста, попробуйте позже.',
      });
    }
  };

  const updateChat = async (chatId: string, updateChatDto: UpdateChatDto): Promise<ChatDto | undefined> => {
    try {
      const response = await $api.patch<ChatDto>(`/chats/${chatId}`, updateChatDto); 
      return response.data;
    } catch (error: any) {
      push.error({
        title: `Ошибка`,
        message: 'Не удалось обновить чат. Пожалуйста, попробуйте позже.',
      });
    }
  };

  const deleteChat = async (chatId: string): Promise<void> => {
    try {
      await $api.delete(`/chats/${chatId}`);
    } catch (error: any) {
      push.error({
        title: `Ошибка`,
        message: 'Не удалось удалить чат. Пожалуйста, попробуйте позже.',
      });
    }
  };

  const branchChat = async (originalChatId: string, branchChatDto: BranchChatDto): Promise<ChatWithMessagesDto | undefined> => {
    try {
      // Бекенд возвращает новый чат (ветку)
      const response = await $api.post<ChatWithMessagesDto>(`/chats/${originalChatId}/branch`, branchChatDto); // Используем $api.post
      return response.data; // Возвращаем только данные нового чата без сообщений для store state
    } catch (error: any) {
      push.error({
        title: `Ошибка`,
        message: 'Не удалось создать ветку для чата',
      });
    }
  };

  // AI Helped
  const sendMessageStream = (
    chatId: string,
    sendMessageDto: SendMessageDto,
    onEvent: (event: ParsedMessageEvent) => void, // Callback для каждого полученного события
    onError: (error: Error) => void, // Callback для ошибок стрима/парсинга
  ) => {
    const controller = new AbortController();
    const { signal } = controller;

    const streamPromise = (async () => {
      try {
        // Используем fetch API, так как Axios не поддерживает SSE POST с телом удобно
        const response = await fetch(`${useRuntimeConfig().public.API_BASE_URL}/chats/${chatId}/messages/stream`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // TODO: Добавьте авторизацию
            'credentials': 'include' // Может быть нужно для куки
          },
          body: JSON.stringify(sendMessageDto),
          signal, // Связываем AbortController с fetch
        });

        if (!response.ok || !response.body) {
          const errorBody = await response.text();
          const statusCode = response.status;
          const statusText = response.statusText;
          const errorMsg = errorBody || statusText || 'Неизвестная ошибка API';
          const error = new Error(`Стрим завершился ошибкой: ${statusCode} ${statusText} - ${errorMsg}`);
          onError(error); // Вызываем onError callback
          return; // Завершаем выполнение async функции
        }

        const reader = response.body.getReader();
        const parser = parseSseStream(reader);

        try {
          for await (const event of parser) {
            if (signal.aborted) break;

            // Если событие - ошибка из бекенда
            if (event.type === 'error' && event.data && 'errorMessage' in event.data) {
              const backendError = new Error(`Ошибка SSE: ${event.data.errorMessage}`);
              onError(backendError);
              reader.cancel(); // Отменяем чтение при ошибке
              break;
            }

            onEvent(event); // Передаем парсенное событие в store
          }
        } catch (streamError: any) {
          if (streamError.name === 'AbortError') {
            console.log('Чтение SSE стрима отменено.');
          } else {
            onError(streamError);
          }
        } finally {
          // Очистка, если требуется
        }

      } catch (fetchError: any) {
        console.error('SSE stream fetch error:', fetchError);
        onError(fetchError);
      }
    })();

    // Возвращаем функцию отмены
    return () => {
      controller.abort();
    };
  };

  const sendMessage = async (chatId: string, content: string, modelId: number) => {
    try {
        const response = await $api.post(`/chats/${chatId}/messages`, { content: content, aiModelId: modelId });
        return response.data;
      } catch (error: any) {
        push.error({
          title: 'Ошибка',
          message: 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.',

        })
      }
    };

  return {
    createChat,
    getUserChats,
    getChatById,
    updateChat,
    // deleteChat,
    // branchChat,
    // sendMessageStream,
    sendMessage,
    branchChat,
  };
};