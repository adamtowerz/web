import classNames from "classnames";
import styles from "./Section.module.scss";

type Props = {
  border?: boolean;
  padding?: boolean;
};

const Section: React.FC<Props> = ({ children, border, padding }) => {
  return (
    <section
      className={classNames(styles.section, {
        [styles.border]: border,
        [styles.padding]: padding,
      })}
    >
      {children}
    </section>
  );
};

export default Section;
