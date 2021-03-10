import classNames from "classnames";
import styles from "./Textarea.module.scss";
import TextareaAutosize from "react-textarea-autosize";

type Props = {
  placeholder: string;
  value: string;
  onChange: (e: any) => void;
  noBorder?: boolean;
};

const Textarea: React.FC<Props> = ({
  placeholder,
  value,
  onChange,
  noBorder,
}) => {
  return (
    <TextareaAutosize
      className={classNames([styles.textarea], {
        [styles.noBorder]: noBorder,
      })}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default Textarea;
