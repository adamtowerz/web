import React from "react";
import type { Moment as MomentRecord } from "../../types";
import styles from "./Moment.module.scss";

const Moment = ({ title, tag_line, time_desc }: MomentRecord) => {
  return (
    <div className={styles.container} key={title}>
      <div className={styles.textContainer}>
        <h3>{title}</h3>
        <p>
          {time_desc} - {tag_line}
        </p>
      </div>
    </div>
  );
};

export default Moment;
