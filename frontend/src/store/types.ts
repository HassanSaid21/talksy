export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

export interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginPayload {
  accessToken: string;
  user: User;
}

export interface Contact {
  _id: string;
  owner: string;
  contact: User;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  id: string;
  text?: string;
  imageUrl?: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participants: User[];
  conversationKey: string;

  lastMessage?: string;
  lastMessageText?: string;
  lastMessageSender?: string;

  lastMessageAt?: string;

  createdAt: string;
  updatedAt: string;
}
