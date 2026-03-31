import { useEffect, useState } from 'react';
import { conversationsApi } from '../api/conversationsApi';
import type {
  ConversationListItem,
  ConversationQueryParams,
  PaginationMeta,
} from '../types/inbox.types';

export function useConversations(params: ConversationQueryParams) {
  const [items, setItems] = useState<ConversationListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await conversationsApi.list(params);
      setItems(response.data);
      setMeta(response.meta);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load conversations.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [params.search, params.status, params.page, params.per_page]);

  return {
    items,
    meta,
    isLoading,
    error,
    reload: load,
  };
}