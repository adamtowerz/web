import classNames from "classnames";
import styles from "./Menu.module.scss";

export type MenuItem = {
  key: string;
  label: string;
  selectable?: boolean; // defaults true
  selected?: boolean; // defaults false
};

type MenuItemProps = {
  items: MenuItem[];
  containerClassName?: string;
};

function Menu({ items, containerClassName }: MenuItemProps) {
  function handleMouseEnter(e: React.MouseEvent<HTMLButtonElement>) {
    (e.target as any).focus();
  }

  return (
    <div
      className={classNames(styles.menuContainer, containerClassName)}
    >
      {items.map((item, idx) => (
        <button
          type="button"
          key={item.key}
          className={classNames("btn", styles.menuItemBtn)}
          onMouseEnter={handleMouseEnter}
          style={{ top: `-${idx}px` }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default Menu;
