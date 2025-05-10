import type { Role } from "./Role.enum";

export interface User {
  firstName: string;
  lastName?: string | null;
  username?: string | null;
  photoUrl?: string | null;
  name?: string | null;
  photo?: string | null;
  role: Role;
}

export type UserDto =
  | { userExists: false }
  | User;
