export interface UserSigned {
    auth: boolean;
    id: string;
    username: string;
    email: string;
    // и т.д.
}

export type UserDto =
  | { auth: false }
  | UserSigned;
