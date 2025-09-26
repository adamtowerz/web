import classNames from "classnames";
import { ReactNode } from "react";
import styles from "./Section.module.scss";

type Props = {
  border?: boolean;
  padding?: boolean;
  children?: ReactNode;
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
