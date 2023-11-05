import styles from "./index.module.scss";

import SingleColumn from "@/components/layout/SingleColumn";
import Socials from "@/components/Socials";

function Header() {
  return (
    <header className={styles.titlebox}>
      <h1>
        Heya, I'm <i>Adam</i>
      </h1>
      <Socials />
    </header>
  );
}

export default function Home() {
  return (
      <SingleColumn header={<Header />} />
  );
}
