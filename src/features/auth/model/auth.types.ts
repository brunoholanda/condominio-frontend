export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthenticatedUser;
}

export interface AuthSession {
  accessToken: string;
  user: AuthenticatedUser;
}
