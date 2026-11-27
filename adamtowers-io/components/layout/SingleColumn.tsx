import Link from "next/link";
import { ReactNode } from "react";

import styles from "./SingleColumn.module.css";

type Props = {
  footer?: boolean;
  children?: ReactNode;
};

const SingleColumn: React.FC<Props> = ({ footer, children }) => {
  return (
    <div className={styles.singleCol}>
      <main>{children}</main>
      {footer && (
        <footer>
          <hr />
          <Link href="/">Adam Towers</Link>
        </footer>
      )}
    </div>
  );
};

export default SingleColumn;
