import { useState } from "react";
import styles from "./Launcher.module.scss";

type LauncherProps = {
    onOpenReportFlow: () => void;
}

function Launcher({ onOpenReportFlow}: LauncherProps) {
//   const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.logo}>D</div>
      <div className={styles.actionMenu}>
        <button className="btn" onClick={onOpenReportFlow}>🐞</button>
      </div>
    </div>
  );
}

export default Launcher;
