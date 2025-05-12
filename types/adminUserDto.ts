import type { User } from "./userDto";

export interface UserDto extends User {
  id: number;
  telegramId: string;
  lastAuth: string;
  createdAt: string;
  updatedAt: string;
}