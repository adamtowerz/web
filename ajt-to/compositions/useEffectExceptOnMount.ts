import React, { useEffect, useRef } from 'react';

const useEffectExceptOnMount: typeof useEffect = (func, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
}

export default useEffectExceptOnMount;