import classNames from "classnames";
import styles from "./Select.module.scss";

type Props = {
  options: string[];
  value: string;
  onChange: (e: any) => void;
  fullWidth?: boolean;
  noBorder?: boolean;
  block?: boolean;
  label?: string;
  id?: string;
};

const Select: React.FC<Props> = ({
  options,
  value,
  onChange,
  fullWidth,
  noBorder,
  block,
  label,
  id,
}) => {
  return (
    <span className={classNames({ [styles.block]: block })}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <select
        className={classNames([styles.select], {
          [styles.fullWidth]: fullWidth,
          [styles.noBorder]: noBorder,
        })}
        value={value}
        onChange={onChange}
        id={id}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </span>
  );
};

export default Select;
