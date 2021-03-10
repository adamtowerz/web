import React from "react";
import Link from "next/link";
import SingleColumn from "./layout/SingleColumn";
import styles from "./ErrorPage.module.scss";

type Props = {
  errorTitle: string;
};

const ErrorPage: React.FC<Props> = ({ errorTitle }) => {
  return (
    <SingleColumn>
      <div className={styles.container}>
        <h1>An Error Occured</h1>
        <p>{errorTitle}</p>
        <Link href="/">
          <a className={styles.homeLink}>Let's go back home</a>
        </Link>
      </div>
    </SingleColumn>
  );
};

export default ErrorPage;
