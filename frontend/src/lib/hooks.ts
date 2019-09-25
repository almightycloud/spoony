import { useCallback, useEffect, useState } from 'react';

// source: https://www.hooks.guide/react-use/useAsync
export function useAsync(fn: () => PromiseLike<unknown>, args: unknown[]): boolean {
  const [isLoading, setLoading] = useState(true);
  const memoized = useCallback(fn, args);

  useEffect(() => {
    let mounted = true;
    const promise = memoized();

    promise.then(
      () => {
        if (mounted) {
          setLoading(false);
        }
      },
      () => {
        if (mounted) {
          setLoading(false);
        }
      },
    );

    return (): void => {
      mounted = false;
    };
  }, [memoized]);

  return isLoading;
}

export default useAsync;
