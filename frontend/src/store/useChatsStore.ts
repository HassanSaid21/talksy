import { create } from "zustand";
import { AxiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast/headless";
import type { AxiosError } from "axios";

import type{
  Contact,
  Conversation,
  Message,
  User,
} from "./types.ts";

export interface ChatsStore {
  allContacts: Contact[];
  allChats: Conversation[];
  allMessages: Message[];

  activeTab: string;

  selectedContact: Contact | null;

  isLoadingContacts: boolean;
  isLoadingChats: boolean;
  isLoadingMessages: boolean;

  isSoundEnabled: boolean;

  toggleSound: () => void;

  setActiveTab: (tab: string) => void;

  setSelectedContact: (contact: Contact | null) => void;

  getAllContacts: () => Promise<void>;

  getAllChats: () => Promise<void>;
}




export const useChatsStore = create<ChatsStore>((set) => ({
  allContacts: [],
  allChats: [],
  allMessages: [],
  activeTab: "chats",
  selectedContact: null,
  isLoadingContacts: false,
  isLoadingChats: false,
  isLoadingMessages: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true" ? true : false,
  toggleSound:  () => set((state)  => {
      const newSoundState = !state.isSoundEnabled;
      localStorage.setItem("isSoundEnabled", newSoundState.toString());
      return { isSoundEnabled: newSoundState };
    }),
  setActiveTab: (tab: string) => set({ activeTab: tab }),
  setSelectedContact: (contact) =>
    set({ selectedContact: contact }),
  getAllContacts: async () => {
    set({ isLoadingContacts: true });
    try {
      const res = await AxiosInstance.get("/messages/contacts");
      set({ allContacts: res.data.contacts });
    } catch (error) {
      const errorMessage: { message?: string } = (error as AxiosError).response
        ?.data || { message: "An error occurred" };
      toast.error(errorMessage.message || "An error occurred");
    } finally {
      set({ isLoadingContacts: false });
    }
  },

  getAllChats: async () => {
    set({ isLoadingChats: true });
    try {
      const res = await AxiosInstance.get("/messages/chats");
      set({ allChats: res.data.chats });
    } catch (error) {
      const errorMessage: { message?: string } = (error as AxiosError).response
        ?.data || { message: "An error occurred" };
      toast.error(errorMessage.message || "An error occurred");
    } finally {
      set({ isLoadingChats: false });
    }
  },
}));
