import { useState } from "react";
import styles from "./Tooltip.module.scss";
import BasePopover from "./BasePopover";

type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
};

const HOVER_TIME_MS = 500;

function Tooltip({ content, children }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [timerHandle, setTimerHandle] = useState(undefined);

  function startTimer() {
    console.log("start timer");
    const handle = setTimeout(() => {
      console.log("open");
      setIsOpen(true);
    }, HOVER_TIME_MS);

    setTimerHandle(handle);
  }

  function cancelTimer() {
    if (timerHandle) {
      clearTimeout(timerHandle);
    }
  }

  function handleMouseEnter() {
    console.log("enter");
    startTimer();
  }

  function handleMouseLeave() {
    console.log("leave");
    setIsOpen(false);
    cancelTimer();
  }

  const popoverContent = <div className={styles.tooltipContainer}>{content}</div>

  return (
    <BasePopover isOpen={isOpen} content={popoverContent} top>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>
    </BasePopover>
  );
}

export default Tooltip;
