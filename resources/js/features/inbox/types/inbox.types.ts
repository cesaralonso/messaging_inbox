export interface ConversationSender {
  id: number;
  name: string;
  email: string;
}

export interface ConversationMessage {
  id: number;
  body: string;
  created_at: string;
  sender: ConversationSender;
}

export interface ConversationListItem {
  id: number;
  subject: string;
  status: 'open' | 'closed';
  unread_count: number;
  last_message: ConversationMessage | null;
}

export interface ConversationParticipant {
  id: number;
  name: string;
  email: string;
}

export interface ConversationDetail {
  id: number;
  subject: string;
  status: 'open' | 'closed';
  participants: ConversationParticipant[];
  messages: ConversationMessage[];
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ConversationsResponse {
  data: ConversationListItem[];
  meta: PaginationMeta;
}

export interface ConversationDetailResponse {
  data: ConversationDetail;
}

export interface UnreadCountResponse {
  data: {
    unread_count: number;
  };
}

export interface CreateConversationPayload {
  subject: string;
  participant_ids: number[];
  message: string;
}

export interface ReplyPayload {
  body: string;
}

export interface ConversationQueryParams {
  search?: string;
  status?: 'open' | 'closed' | '';
  page?: number;
  per_page?: number;
}