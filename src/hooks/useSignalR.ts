import { useEffect } from 'react';
import { onEvent, offEvent, startConnection } from '@/services/signalRService';

export const useSignalR = <T>(
  eventName: string,
  callback: (data: T) => void
) => {
  useEffect(() => {
    const init = async () => {
      await startConnection();
      onEvent<T>(eventName, callback);
    };

    init();

    return () => {
      offEvent(eventName);
    };
  }, [eventName, callback]);
};
