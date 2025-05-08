export interface User {
    id: string;
    username: string;
    email: string;
    // и т.д.
}

export type UserDto =
  | { userExists: false }
  | User;
