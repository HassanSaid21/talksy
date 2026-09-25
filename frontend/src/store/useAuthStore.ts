import { create } from "zustand";
import type { AuthStatus, LoginPayload, User   } from "./types";
import { persist } from "zustand/middleware";
import { AxiosInstance } from "../lib/axios";
import toast from "react-hot-toast";





interface AuthStore {
  accessToken: string | null;
  user: User | null;
  status: AuthStatus;

  login: (payload: LoginPayload) => void;
  logout: () => void;

  setAccessToken: (token: string) => void;
  setUser: (user: User | null) => void;

  setStatus: (status: AuthStatus) => void;
  updateProfile: (profileData: { profilePicUrl: string }) => Promise<void>;
}

export const useAuthStore = create<AuthStore>() (
  persist(
    (set) => ({
  accessToken: null,
  user: null,

  // App starts by checking whether a session exists
  status: "unauthenticated",

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

    updateProfile: async (profileData: { profilePicUrl: string }) => {
      try {
        const response = await AxiosInstance.put("/auth/update-profile", profileData);
        set((state) => ({
          user: {
            ...state.user,
            profilePicture: response.data.user.profilePicture,
          } as User,
        }));
        toast.success("Profile updated successfully");
      } catch (error) {
        console.error("Failed to update profile:", error);
        toast.error("Failed to update profile");
        throw error;
      }
    },


    }),
   
{
      name: "auth-storage", // key in localStorage
      partialize:(state)=>({
 user:state.user,
 status:state.status
})
    }));
