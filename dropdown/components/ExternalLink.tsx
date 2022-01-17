import React, { useState } from "react";
import classNames from "classnames";

import styles from "./ExternalLink.module.scss";
import Tooltip from "./Tooltip";

type ExternalLinkProps = {
  href: string;
  label: string;
};

const actions = [
  {
    id: "open in new tab",
    icon: "↗",
  },
  {
    id: "copy link",
    icon: "❐",
  },
];

function ExternalLink({ href, label }: ExternalLinkProps) {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.container} onMouseLeave={() => setShow(false)}>
      <a
        className={styles.label}
        href={href}
        onMouseEnter={() => setShow(true)}
      >
        {label}
      </a>
      {show && (
        <div className={styles.popover}>
          <a
            className={styles.popoverLabel}
            href={href}
            onMouseEnter={() => setShow(true)}
          >
            {label}
          </a>

          <div className={styles.actions}>
            {actions.map((action) => (
              <Tooltip key={action.id} content={action.id}>
                <button type="button" className={styles.actionBtn}>
                  {action.icon}
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExternalLink;
