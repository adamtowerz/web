import Link from "next/link";
import { ReactNode } from "react";
import Socials from "../Socials";

import styles from "./SingleColumn.module.scss";

type Props = {
  header?: true | ReactNode;
  footer?: boolean;
  children?: ReactNode;
};

export const DEFAULT_HEADER = (
  <header className={styles.titlebox}>
    <h1>
      Heya, I'm <b>Adam</b>
    </h1>
    <Socials />
  </header>
);

const SingleColumn: React.FC<Props> = ({ header, footer, children }) => {
  let headerForRender: ReactNode = null;
  if (header) {
    if (header === true) {
      headerForRender = DEFAULT_HEADER;
    } else {
      headerForRender = header;
    }
  }

  return (
    <div className={styles.singleCol}>
      {headerForRender}
      <main className={styles.content}>{children}</main>
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
