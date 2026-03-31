import { useState } from 'react';
import { conversationsApi } from '../api/conversationsApi';

export function useReplyToConversation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reply = async (conversationId: number, body: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      return await conversationsApi.reply(conversationId, { body });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reply.';
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    reply,
    isSubmitting,
    error,
  };
}