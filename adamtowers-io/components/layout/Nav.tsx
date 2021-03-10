import Link from "next/link";
import styles from "./Nav.module.scss";

const Nav = () => {
  return (
    <nav className={styles.nav}>
      <Link href="/">Adam Towers</Link>
    </nav>
  );
};

export default Nav;
