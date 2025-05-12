import type { AIModelDto } from "./AIModelDto";

export type MessageRole = 'USER' | 'AI';

export interface Message {
  id: string,
  chatId: string,
  content: string,
  role: MessageRole,
  createdAt: string;,
  llmId: number | null,
  llm: AIModelDto | null;
}

export interface ChatDto {
  id: string,
  userId: number,
  title: string,
  createdAt: Date | string;
  updatedAt: Date | string;
  parentChatId: string;
  branchedAfterMessageId: string;
  isArchived: boolean;
  childBranches: ChatDto[];
}

export interface ChatWithMessagesDto extends ChatDto {
  messages: Message[];
}

export interface BranchChatDto {
  branchedAfterMessageId: string;
  initialMessageContent?: string;
  title?: string;
  aiModelId?: number;
}

// export interface ParsedMessageEvent {
//     // data: object | string;
//     data: object;
//     id?: string;
//     type?: string;
//     retry?: number;
// } 

export interface CreateChatDto {
    initialMessage?: string;
    title?: string;
    aiModelId?: number;
}

export interface UpdateChatDto {
    title?: string;
    // isArchived?: boolean;
}

// export interface SendMessageDto {
//     content: string;
//     aiModelId?: number;
//     temperature?: number;
//     max_tokens?: number;
// }
