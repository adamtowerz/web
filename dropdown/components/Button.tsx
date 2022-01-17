import classNames from "classnames";
import styles from "./Button.module.scss";
import Loading from "./Loading";

interface ButtonProps {
  type?: "submit" | "reset" | "button";
  theme?: "primary" | "link";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

function Button({
  type = "button",
  theme = "primary",
  onClick,
  children,
  disabled,
  loading,
  className,
}: ButtonProps) {
  const onClickWrapper = () => onClick && !disabled && !loading && onClick();

  return (
    <button
      className={classNames("btn",
        styles.btn,
        {
          disabled,
          loading,
        },
        theme,
        className
      )}
      type={type}
      onClick={onClickWrapper}
    >
      <span>{children}</span>
      {loading && (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      )}
    </button>
  );
}

export default Button;
