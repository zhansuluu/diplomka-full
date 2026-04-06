import { useState, useEffect, useCallback } from "react";

export interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseAsyncActions<T> {
  refetch: () => Promise<void>;
  reset: () => void;
}

/**
 * Hook для управления асинхронными операциями с loading/error/data состояниями
 * Production-ready решение для API calls
 */
export function useAsyncData<T>(
  asyncFunction: () => Promise<T>,
  dependencies: React.DependencyList = []
): UseAsyncState<T> & UseAsyncActions<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  useEffect(() => {
    execute();
  }, dependencies);

  const refetch = useCallback(async () => {
    await execute();
  }, [execute]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    reset,
  };
}

/**
 * Hook для запуска асинхронной функции по требованию (не при монтировании)
 * Полезно для POST/PUT/DELETE операций
 */
export function useAsyncMutation<T, Args extends unknown[]>(
  asyncFunction: (...args: Args) => Promise<T>
): {
  execute: (...args: Args) => Promise<T>;
  data: T | null;
  loading: boolean;
  error: Error | null;
  reset: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: Args): Promise<T> => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { execute, data, loading, error, reset };
}
