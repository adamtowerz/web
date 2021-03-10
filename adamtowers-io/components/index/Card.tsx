import React, { useState } from "react";
import classNames from "classnames";
import Image from "next/image";
import hydrate from "next-mdx-remote/hydrate";
import type { Achievement, Employment, Project } from "../../types";
import styles from "./Card.module.css";

const Card = ({
  title,
  tag_line,
  time_desc,
  desc,
  image,
  link,
  link_label,
  tags,
}: Employment | Project | Achievement) => {
  const [active, setActive] = useState(false);
  const content = hydrate(desc);
  return (
    <button
      className={classNames(styles.card, { [styles.active]: active })}
      onClick={() => setActive(!active)}
      aria-label="Expand Item"
      key={title}
    >
      <div className={styles.titleRow}>
        <div className={styles.imageContainer}>
          {image && (
            <Image
              className={styles.image}
              src={image}
              width={64}
              height={64}
            />
          )}
        </div>
        <div className={styles.titlebox}>
          <h3 className={styles.title}>{title}</h3>
          {false && <p className={styles.subtitle}>{tag_line}</p>}
          <p className={styles.substitle}>{tag_line}</p>
          <p className={styles.timeDesc}>{time_desc}</p>
        </div>
      </div>

      {active && (
        <>
          {tags?.length > 0 && (
            <div className={styles.tagList}>
              {tags.map((t, i) => (
                <span key={i} className={styles.tag}>
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className={styles.longDesc}>{content}</div>
          {link && (
            <a className={styles.link} href={link}>
              {link_label}
            </a>
          )}
        </>
      )}
    </button>
  );
};

export default Card;
