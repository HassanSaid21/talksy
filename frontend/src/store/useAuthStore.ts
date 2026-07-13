import { create } from "zustand";
import type { AuthStatus, LoginPayload, User ,  } from "./types";






interface AuthStore {
  accessToken: string | null;
  user: User | null;
  status: AuthStatus;

  login: (payload: LoginPayload) => void;
  logout: () => void;

  setAccessToken: (token: string) => void;
  setUser: (user: User | null) => void;

  setStatus: (status: AuthStatus) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  user: null,

  // App starts by checking whether a session exists
  status: "authenticated",

  login: ({ accessToken, user }) =>
    set({
      accessToken,
      user,
      status: "authenticated",
    }),

  logout: () =>
    set({
      accessToken: null,
      user: null,
      status: "unauthenticated",
    }),

  setAccessToken: (token) =>
    set({
      accessToken: token,
      status: "authenticated",
    }),

  setUser: (user) =>
    set({
      user,
    }),

  setStatus: (status) =>
    set({
      status,
    }),
}));