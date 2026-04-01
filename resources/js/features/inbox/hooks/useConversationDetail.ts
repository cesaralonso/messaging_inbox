import { useEffect, useState } from 'react';
import { conversationsApi } from '../api/conversationsApi';
import type { ConversationDetail } from '../types/inbox.types';

interface UseConversationDetailOptions {
  enabled?: boolean;
}

export function useConversationDetail(
  conversationId: number | null,
  options: UseConversationDetailOptions = {}
) {
  const { enabled = true } = options;

  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!enabled || !conversationId) {
      setConversation(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await conversationsApi.detail(conversationId);
      setConversation(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load conversation.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [enabled, conversationId]);

  return {
    conversation,
    isLoading,
    error,
    reload: load,
  };
}
