import { useEffect, useState } from 'react';
import { conversationsApi } from '../api/conversationsApi';
import type { ConversationDetail } from '../types/inbox.types';

export function useConversationDetail(conversationId: number | null) {
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!conversationId) {
      setConversation(null);
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
  }, [conversationId]);

  return {
    conversation,
    isLoading,
    error,
    reload: load,
  };
}