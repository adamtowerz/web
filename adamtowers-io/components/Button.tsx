import classNames from "classnames";
import styles from "./Button.module.scss";
import Loading from "./Loading";

type Props = {
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
  disable?: boolean;
  loading?: boolean;
};

const Button: React.FC<Props> = ({
  type = "button",
  onClick,
  children,
  disable,
  loading,
}) => {
  const onClickWrapper = () => onClick && !disable && !loading && onClick();

  return (
    <button
      className={classNames([styles.btn], {
        [styles.disable]: disable,
      })}
      type={type}
      onClick={onClickWrapper}
    >
      <span className={styles.btnContent}>{children}</span>
      {loading && (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      )}
    </button>
  );
};

export default Button;
