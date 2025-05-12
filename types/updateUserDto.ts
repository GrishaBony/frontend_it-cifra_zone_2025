import type { Role } from "./Role.enum";

export interface UpdateUserDto {
    username?: string;
    name?: string;
    role?: Role;
}