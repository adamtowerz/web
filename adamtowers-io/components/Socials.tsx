import styles from "./Socials.module.css";

const Socials = () => (
  <ul className={styles.container}>
    <li className={styles.li}>
      <a
        href="https://twitter.com/adamtowerz"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-twitter"></i>
      </a>
    </li>
    <li className={styles.li}>
      <a
        href="https://www.linkedin.com/in/adam-towers"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-linkedin"></i>
      </a>
    </li>
    <li className={styles.li}>
      <a
        href="https://github.com/adamtowerz"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-github"></i>
      </a>
    </li>
    <li className={styles.li}>
      <a
        href="mailto:adam@towers.email"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fa fa-envelope"></i>
      </a>
    </li>
  </ul>
);

export default Socials;
