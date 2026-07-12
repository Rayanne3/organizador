export type UserRole = "ADMIN" | "GUEST";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Opcional para não circular o hash desnecessariamente
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  token: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}