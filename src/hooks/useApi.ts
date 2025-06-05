import { useState, useEffect, useCallback } from 'react';

export const useApi = <T>(apiCall: () => Promise<T>, deps: any[] = []) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    console.log('API call trigger');
    setLoading(true);
    setError(null);
    setData(null);

    apiCall()
      .then((response) => setData(response))
      .catch((err) => {
        const message = (err.response?.data?.message as string) || err.message;
        setError(message);
      })
      .finally(() => setLoading(false));
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
};
