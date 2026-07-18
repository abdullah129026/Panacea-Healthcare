import "server-only";

import type {
  ApiResult,
  Conversation,
  ConversationDetail,
  Message,
  Paginated,
} from "@/types";
import { serverApi } from "@/lib/api";

/**
 * Server-only communications data access. Thin, typed wrappers over the
 * API client. Tenant scope + auth headers are injected by `serverApi`; every
 * call resolves to `ApiResult` (never throws).
 */

export type ConversationListParams = {
  search?: string;
  type?: string;
  page?: number;
  pageSize?: number;
};

export function listConversations(
  params: ConversationListParams = {}
): Promise<ApiResult<Paginated<Conversation>>> {
  return serverApi.get<Paginated<Conversation>>("/conversations", {
    query: {
      search: params.search,
      type: params.type,
      page: params.page,
      pageSize: params.pageSize,
    },
  });
}

export function getConversation(
  id: string
): Promise<ApiResult<ConversationDetail>> {
  return serverApi.get<ConversationDetail>(
    `/conversations/${encodeURIComponent(id)}`
  );
}

export type MessageListParams = {
  conversationId: string;
  page?: number;
  pageSize?: number;
};

export function listMessages(
  params: MessageListParams
): Promise<ApiResult<Paginated<Message>>> {
  return serverApi.get<Paginated<Message>>(
    `/conversations/${encodeURIComponent(params.conversationId)}/messages`,
    {
      query: {
        page: params.page,
        pageSize: params.pageSize,
      },
    }
  );
}

export function sendMessage(
  conversationId: string,
  text: string,
  attachmentUrl?: string
): Promise<ApiResult<Message>> {
  return serverApi.post<Message>(
    `/conversations/${encodeURIComponent(conversationId)}/messages`,
    {
      body: {
        text,
        attachmentUrl,
      },
    }
  );
}
