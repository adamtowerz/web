import React, { useEffect, useState } from "react";
import { useTimeout } from "./timeout";

type UseAnimationArgs = {
  name: string;
  length: number; // ms
  onMount?: boolean;
  options?: React.CSSProperties;
};

export function useAnimation({
  name,
  length,
  onMount,
  options,
}: UseAnimationArgs) {
  const [direction, setDirection] = useState<
    React.CSSProperties["animationDirection"] | undefined
  >(undefined);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [count, setCount] = useState(0);
  const timeout = useTimeout();

  function animate(direction?: React.CSSProperties["animationDirection"]) {
    setDirection(direction ?? "normal");
    setIsAnimating(true);
    setCount(count + 1);

    timeout(() => {
      setIsAnimating(false);
    }, length);
  }

  const style: React.CSSProperties = {
    animationName: name,
    animationDuration: `${length}ms`,
    animationDirection: direction,
    animationFillMode: direction === "reverse" ? "backwards" : "forwards",
    animationPlayState: "running",
    animationIterationCount: count,
    ...options,
  };

  style.animationPlayState = isAnimating ? "running" : "paused";

  useEffect(() => {
    if (onMount) {
      animate();
    }
  }, [onMount]);

  return { style, animate, isAnimating };
}

export function useTogglableAnimation({
  ...useAnimationArgs
}: UseAnimationArgs) {
  // two states, yes and no. lol
  const [isYes, setIsYes] = useState(false);
  const { style, animate, isAnimating } = useAnimation(useAnimationArgs);

  function toggle() {
    animate(!isYes ? "normal" : "reverse");
    setIsYes(!isYes);
  }

  return { isYes, setIsYes, toggle, style, animate, isAnimating };
}
