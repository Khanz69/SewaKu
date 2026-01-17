export interface User {
  id: string;
  createdAt: number;
  fullName: string;
  phone: number;
  email: string;
  avatar?: string;
  passwordHash?: string;
}

export type CreateUserPayload = {
  fullName: string;
  phone: number;
  email: string;
  password: string;
};

export type UpdateUserPayload = Partial<Omit<CreateUserPayload, "password">> & {
  password?: string;
};

export interface AuthResponse {
  user: User;
  token?: string;
}
