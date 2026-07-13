export type AuthStatus =
  | "checking"
  | "authenticated"
  | "unauthenticated";

export interface User {
  _id: string;
  name: string;
  email: string;
  // Add more fields as your API grows
}

export interface LoginPayload {
  accessToken: string;
  user: User;
}
