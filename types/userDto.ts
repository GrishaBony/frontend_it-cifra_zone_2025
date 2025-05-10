export interface User {
  firstName: string;
  lastName?: string | null;
  username?: string | null;
  photoUrl?: string | null;
  name?: string | null;
  photo?: string | null;
  role: 'USER' | 'ORG_USER' | 'ADMIN';
}

export type UserDto =
  | { userExists: false }
  | User;
