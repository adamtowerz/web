import styles from "./BasePopover.module.scss";
import classNames from "classnames";

type BasePopoverDirectionProps =
  | {
      top: true;
    }
  | {
      bottom: true;
    }
  | {
      left: true;
    }
  | {
      right: true;
    };

type BasePopoverProps = {
  isOpen: boolean;
  content: React.ReactNode;
  children: React.ReactNode;
  inline?: boolean;
} & BasePopoverDirectionProps;

function getDirectionClass(props: BasePopoverDirectionProps): string {
  for (const key of ["top", "bottom", "left", "right"]) {
    if (key in props) {
      return styles[key];
    }
  }

  return styles["top"];
}

function BasePopover({
  isOpen,
  content,
  children,
  inline,
  ...rest
}: BasePopoverProps) {
  const direction = getDirectionClass(rest);

  return (
    <div
      className={classNames(styles.container, {
        inline,
      })}
    >
      {isOpen && (
        <div className={classNames(styles.popoverContainer, direction)}>
          {content}
        </div>
      )}
      {children}
    </div>
  );
}

export default BasePopover;
