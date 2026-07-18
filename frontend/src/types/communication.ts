/**
 * Communications domain types.
 * Represents messaging, conversations, and alerts.
 */

export type ConversationType = "direct" | "group" | "system";
export type UserRole = "doctor" | "nurse" | "staff" | "patient" | "system";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  incoming: boolean;
  text?: string;
  attachment?: {
    name: string;
    size: string;
    url?: string;
  };
  sentAt: string;
  readAt?: string;
}

export interface Conversation {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  avatarBg: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  type: ConversationType;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}
