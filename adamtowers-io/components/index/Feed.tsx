import React from "react";
import type { FeedItem } from "../../types";
import { FeedItemType } from "../../types";
import Card from "./Card";
import styles from "./Card.module.css";
import Moment from "./Moment";

type Props = {
  feed: FeedItem[];
};

const Feed = ({ feed }: Props) => {
  return (
    <div className={styles.list}>
      {feed.map((item) => {
        if (item.type === FeedItemType.Moment) {
          return <Moment {...item} />;
        } else {
          return <Card {...item} />;
        }
      })}
    </div>
  );
};

export default Feed;
