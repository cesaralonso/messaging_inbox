import { apiClient } from '@/lib/apiClient';
import type {
  ConversationDetailResponse,
  ConversationsResponse,
  CreateConversationPayload,
  ReplyPayload,
  UnreadCountResponse,
  ConversationQueryParams,
  InboxUsersResponse,
} from '../types/inbox.types';

function toQueryString(params: ConversationQueryParams = {}): string {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.per_page) searchParams.set('per_page', String(params.per_page));

  const query = searchParams.toString();

  return query ? `?${query}` : '';
}

export const conversationsApi = {
  list(params: ConversationQueryParams = {}) {
    return apiClient.get<ConversationsResponse>(
      `/conversations${toQueryString(params)}`,
      true
    );
  },

  detail(conversationId: number) {
    return apiClient.get<ConversationDetailResponse>(
      `/conversations/${conversationId}`,
      true
    );
  },

  users() {
    return apiClient.get<InboxUsersResponse>('/users', true);
  },

  create(payload: CreateConversationPayload) {
    return apiClient.post<{
      message: string;
      data: { id: number; subject: string; status: 'open' | 'closed' };
    }>('/conversations', payload, true);
  },

  reply(conversationId: number, payload: ReplyPayload) {
    return apiClient.post<{
      message: string;
      data: {
        id: number;
        body: string;
        created_at: string;
        sender: {
          id: number;
          name: string;
          email: string;
        };
      };
    }>(`/conversations/${conversationId}/messages`, payload, true);
  },

  unreadCount() {
    return apiClient.get<UnreadCountResponse>('/conversations/unread-count', true);
  },

  markAsRead(conversationId: number) {
    return apiClient.patch<{ message: string }>(
      `/conversations/${conversationId}/read`,
      undefined,
      true
    );
  },
};