/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";

type useServiceResult<T> = {
  data: T | null;
  callRequest: (...args: any[]) => Promise<T | void>;
  isLoading: boolean;
  error: string | null;
};

interface UseServiceParamsOptions<T> {
  callOnLoad?: boolean;
  pollingInterval?: number;
  onSuccess?: (response: T) => void;
  onError?: (errorMessage: string) => void;
}

export function useService<T>(
  request: (...args: any[]) => Promise<T | void>,
  { callOnLoad = true, pollingInterval, onSuccess, onError }: UseServiceParamsOptions<T> = {},
): useServiceResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(callOnLoad ? true : false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const callRequest = useCallback(
    async (...args: any[]) => {
      if (!pollingInterval) {
        setIsLoading(true);
      }
      setError(null);

      try {
        const response = await request(...args);

        setData(response ?? null);
        if (response) {
          onSuccess?.(response);
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred";

        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [pollingInterval, request, onSuccess, onError],
  );

  useEffect(() => {
    if (callOnLoad) {
      callRequest();
    }

    if (pollingInterval) {
      const poll = () => {
        timeoutRef.current = setTimeout(async () => {
          await callRequest();
          poll();
        }, pollingInterval);
      };

      poll();

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [callOnLoad, callRequest, pollingInterval]);

  return { callRequest, data, error, isLoading };
}
