import React, { useState } from "react";
import classNames from "classnames";
import styles from "./Popover.module.css";

type Props = {
  children: React.ReactChildren | string;
  popoverContent: React.ReactNode;
};

const Popover = ({ children, popoverContent }: Props) => {
  const [isOpen, setOpen] = useState(false);

  const onKeyPress = (e) => {
    if (e.keyCode === 0) {
      setOpen(!isOpen);
    }
  };

  return (
    <>
      <span
        className={classNames(styles.popover, { [styles.active]: isOpen })}
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!isOpen)}
        onKeyPress={onKeyPress}
      >
        {children}
      </span>
      {isOpen && (
        <div className={styles.popoverContainer}>{popoverContent}</div>
      )}
    </>
  );
};

export default Popover;
