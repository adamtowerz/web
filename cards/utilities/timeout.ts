import { useEffect, useState } from "react";

export function useTimeout() {
  const [timeoutHandler, setTimeoutHandler] = useState<
    NodeJS.Timeout | undefined
  >(undefined);

  useEffect(() => {
    return () => {
      if (timeoutHandler) {
        clearTimeout(timeoutHandler);
      }
    };
  }, []);

  function timeout(cb: () => void, duration: number) {
    if (timeoutHandler) {
      clearTimeout(timeoutHandler);
    }

    const handle = setTimeout(cb, duration);
    setTimeoutHandler(handle);
  }

  return timeout;
}
