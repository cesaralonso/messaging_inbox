import { useEffect, useState } from 'react';
import { conversationsApi } from '../api/conversationsApi';

interface UseUnreadCountOptions {
  enabled?: boolean;
}

export function useUnreadCount(options: UseUnreadCountOptions = {}) {
  const { enabled = true } = options;

  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const load = async () => {
    if (!enabled) {
      setCount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await conversationsApi.unreadCount();
      setCount(response.data.unread_count);
    } catch {
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [enabled]);

  return {
    count,
    isLoading,
    reload: load,
  };
}
