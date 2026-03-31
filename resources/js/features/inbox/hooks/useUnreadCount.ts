import { useEffect, useState } from 'react';
import { conversationsApi } from '../api/conversationsApi';

export function useUnreadCount() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const load = async () => {
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
  }, []);

  return {
    count,
    isLoading,
    reload: load,
  };
}