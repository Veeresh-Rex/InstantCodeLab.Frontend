import { useState, useEffect } from 'react';

export const useApi = (apiCall) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useEffect(() => {
    setLoading(true);
    setError(null);
    setData(null);

    apiCall()
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response?.data?.message || err.message;
        setError(message);
        setLoading(false);
      });
  }, [apiCall]);

  return { data, loading, error, fetchData };
};
