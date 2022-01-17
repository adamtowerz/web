import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import classNames from "classnames";
import styles from "./Dropdown.module.scss";
import Menu, { MenuItem } from "./Menu";

type DumbDropdownProps = {
  items: MenuItem[];
  onTap: (key: string) => void;
};

export function DumbDropdown(props: DumbDropdownProps) {
  const [showMenu, setShowMenu] = useState(false);

  function handleBlur(event) {
    // if the blur was because of outside focus
    // currentTarget is the parent element, relatedTarget is the clicked element
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowMenu(false);
    }
  }

  function handleDropdownTargetMouseEnter(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    if (showMenu) {
      (e.target as any).focus();
    }
  }

  return (
    <div className={styles.dropdownContainer} onBlur={handleBlur}>
      <button
        type="button"
        className={classNames(
          "btn",
          styles.dropdownTarget,
          styles.dropdownDefaultTarget,
          { [styles.open]: showMenu }
        )}
        onClick={() => setShowMenu(!showMenu)}
        onMouseEnter={handleDropdownTargetMouseEnter}
      >
        dropdown <span className={styles.dropdownTargetChevron}>▼</span>
      </button>
      <div className={styles.dropdownContainerClip}>
        <CSSTransition
          in={showMenu}
          unmountOnExit
          timeout={200}
          classNames="slide-down"
        >
          <Menu items={props.items} containerClassName={styles.dropdownMenu} />
        </CSSTransition>
      </div>
    </div>
  );
}

type SmartDropdownProps = {
  items: {
    key: string;
    label: string;
  }[];
  initiallySelected?: string[]; // array of keys
  maxSelected?: number; // defaults to 1
};

export function SmartDropdown(props: SmartDropdownProps) {
  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>({});

  const items: MenuItem[] = props.items.map((item) => ({
    ...item,
    selected: Boolean(selectedMap[item.key]),
  }));

  return <DumbDropdown items={items} onTap={() => {}} />;
}
