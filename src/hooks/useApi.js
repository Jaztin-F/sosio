// src/hooks/useApi.js
import { useState, useEffect, useCallback, useRef } from "react";

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);

  const optionsRef = useRef(options);
  useEffect(() => { optionsRef.current = options; }, [options]);

  const fetchData = useCallback(async (overrideUrl) => {
    const fetchUrl = overrideUrl || url;
    if (!fetchUrl) return;
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(fetchUrl, {
        method: optionsRef.current.method || 'GET',
        headers: {
          "Content-Type": "application/json",
          ...(optionsRef.current.headers || {})
        },
        ...optionsRef.current
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result && typeof result === "object" && "success" in result) {
        if (result.success) {
          setData(result.data ?? result.user ?? result);
        } else {
          throw new Error(result.message || "API request failed");
        }
      } else {
        setData(result);
      }
    } catch (err) {
      setError(err.message || String(err));
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (url) fetchData();
  }, [url, fetchData]);

  return { data, loading, error, refetch: fetchData };
};
