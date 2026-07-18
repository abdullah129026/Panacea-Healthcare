import { Header } from "@/components/layout/Header";
import { requireRole } from "@/lib/auth";
import { listConversations, getConversation } from "@/lib/communications";
import { ChatInterface } from "./ChatInterface";

export default async function CommunicationsPage() {
  await requireRole(["admin", "clinician", "support"]);

  const [conversationsResult, firstConversationResult] = await Promise.all([
    listConversations({ pageSize: 50 }),
    // We'll attempt to get the first conversation - in a real scenario,
    // the API would return a default conversation ID or we'd load it separately
    getConversation("default"),
  ]);

  const conversations = conversationsResult.success
    ? conversationsResult.data.items
    : [];

  // If no first conversation result, create a placeholder
  const initialConversation = firstConversationResult.success
    ? firstConversationResult.data
    : conversations.length > 0
      ? ({
          ...conversations[0],
          messages: [],
        })
      : {
          id: "",
          name: "No Conversations",
          role: "system" as const,
          avatar: "—",
          avatarBg: "bg-muted text-muted-foreground",
          lastMessage: "Start a new conversation to begin messaging.",
          lastMessageTime: "—",
          unreadCount: 0,
          online: false,
          type: "direct" as const,
          messages: [],
        };

  return (
    <>
      <Header
        breadcrumbs={[
          { label: "Clinical Operations", href: "#" },
          { label: "Communications" },
        ]}
      />

      <ChatInterface
        conversations={conversations}
        initialConversation={initialConversation}
      />
    </>
  );
}
