import SingleColumn from "../components/layout/SingleColumn";
import Link from "next/link";
import styles from "../styles/pages/404.module.scss";

export default function NotFound() {
  return (
    <SingleColumn title="404 | Adam Towers" footer>
      <div className={styles.container}>
        <h1>404: Page not found</h1>
        <Link href="/" className={styles.homeLink}>
          Let's go back home
        </Link>
      </div>
    </SingleColumn>
  );
}