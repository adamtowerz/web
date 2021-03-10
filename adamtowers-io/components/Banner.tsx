import { Banner as BannerData } from "types";
import classNames from "classnames";
import styles from "./Banner.module.scss";

type Props = BannerData & { className?: string };

const Banner: React.FC<Props> = ({
  title,
  subtitle,
  link,
  link_label,
  className,
}) => {
  return (
    <div className={classNames(styles.banner, className)}>
      <p className={styles.title}>{title}</p>
      <p className={styles.subtitle}>{subtitle}</p>
      <a href={link} className={styles.link}>
        {link_label}
      </a>
    </div>
  );
};

export default Banner;
