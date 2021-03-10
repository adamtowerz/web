import classNames from "classnames";
import styles from "./Input.module.scss";

type Props = {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: any) => void;
  fullWidth?: boolean;
  noBorder?: boolean;
  block?: boolean;
  className?: string;
  id?: string;
  label?: string;
};

const Input: React.FC<Props> = ({
  type,
  placeholder,
  value,
  onChange,
  fullWidth,
  noBorder,
  block,
  className,
  id,
  label,
}) => {
  return (
    <span className={classNames({ [styles.block]: block })}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={classNames([styles.input], {
          [styles.fullWidth]: fullWidth,
          [styles.noBorder]: noBorder,
          [className]: className,
        })}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </span>
  );
};

export default Input;
