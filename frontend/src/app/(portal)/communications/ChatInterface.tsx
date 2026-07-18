"use client";

import { useActionState, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Send,
  Smile,
  FileText,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui";
import type { Conversation, Message, ConversationDetail } from "@/types";
import { sendMessage } from "./actions";
import type { FormState } from "@/lib/forms";

interface ChatInterfaceProps {
  conversations: Conversation[];
  initialConversation: ConversationDetail;
}

const initialFormState: FormState = {};
const chatTabs = ["All", "Inbox", "Mail"];

export function ChatInterface({
  conversations,
  initialConversation,
}: ChatInterfaceProps) {
  const [activeChatTab, setActiveChatTab] = useState("All");
  const [selectedChat, setSelectedChat] = useState<ConversationDetail>(initialConversation);
  const [messageText, setMessageText] = useState("");
  const [state, formAction, pending] = useActionState(
    sendMessage,
    initialFormState
  );
  const [messages, setMessages] = useState<Message[]>(selectedChat.messages);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const formData = new FormData();
    formData.set("conversationId", selectedChat.id);
    formData.set("text", messageText);

    await formAction(formData);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Title Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-mono text-foreground">
            Communications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Send messages, staff memos and coordinate patient care
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-card rounded-2xl border border-border overflow-hidden min-h-[calc(100vh-220px)]">
        {/* Left Panel – Chat List */}
        <div className="lg:col-span-4 xl:col-span-3 border-r border-border flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent border border-border text-sm">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground flex-1"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 pt-3">
            {chatTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveChatTab(tab)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-medium transition-colors",
                  activeChatTab === tab
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto p-2">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="w-6 h-6 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No conversations yet
                </p>
              </div>
            ) : (
              conversations.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat as ConversationDetail)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-xl transition-colors text-left",
                    selectedChat.id === chat.id
                      ? "bg-accent"
                      : "hover:bg-accent/50"
                  )}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold",
                        chat.avatarBg
                      )}
                    >
                      {chat.avatar}
                    </div>
                    {chat.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#004D1A] rounded-full border-2 border-card" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-medium text-foreground truncate">
                        {chat.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-2 shrink-0">
                        {chat.lastMessageTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground truncate pr-2">
                        {chat.lastMessage}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {chat.role}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Panel – Chat View */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold",
                  selectedChat.avatarBg
                )}
              >
                {selectedChat.avatar}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {selectedChat.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {selectedChat.online ? "Online" : "Offline"} —
                  Today&apos;s Chat
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                <Phone className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                <Video className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Date Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] text-muted-foreground font-medium">
                Today
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="w-6 h-6 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.incoming ? "justify-start" : "justify-end"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-3",
                      msg.incoming
                        ? "bg-accent text-foreground rounded-tl-sm"
                        : "bg-[#004D1A] text-white rounded-tr-sm"
                    )}
                  >
                    {msg.text && (
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    )}

                    {msg.attachment && (
                      <div
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl mt-1",
                          msg.incoming ? "bg-card" : "bg-white/10"
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                            msg.incoming
                              ? "bg-error/20"
                              : "bg-white/10"
                          )}
                        >
                          <FileText
                            className={cn(
                              "w-5 h-5",
                              msg.incoming
                                ? "text-error-foreground"
                                : "text-white/80"
                            )}
                          />
                        </div>
                        <div className="min-w-0">
                          <p
                            className={cn(
                              "text-sm font-medium truncate",
                              msg.incoming ? "text-foreground" : "text-white"
                            )}
                          >
                            {msg.attachment.name}
                          </p>
                          <p
                            className={cn(
                              "text-xs",
                              msg.incoming
                                ? "text-muted-foreground"
                                : "text-white/60"
                            )}
                          >
                            {msg.attachment.size}
                          </p>
                        </div>
                      </div>
                    )}

                    <p
                      className={cn(
                        "text-[10px] mt-1.5",
                        msg.incoming ? "text-muted-foreground" : "text-white/60"
                      )}
                    >
                      {msg.sentAt}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
            {state.error && (
              <p className="rounded-lg bg-error px-3 py-2 text-sm text-error-foreground mb-3">
                {state.error}
              </p>
            )}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <Paperclip className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent border border-border">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message or use '/' for clinical commands..."
                  className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground flex-1"
                />
                <button
                  type="button"
                  className="p-1 hover:text-foreground transition-colors"
                >
                  <Smile className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <button
                type="submit"
                disabled={pending || !messageText.trim()}
                className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
