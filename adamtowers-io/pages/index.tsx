import { GetStaticProps } from "next";
import Airtable from "airtable";
import type { Banner as BannerData, FeedItem } from "../types";
import getFeed from "data/Feed";
import getBanner from "data/Banner";

import styles from "./index.module.scss";

import SingleColumn from "@/components/layout/SingleColumn";
import Content from "@/components/index/Content";
import Feed from "@/components/index/Feed";
import Banner from "@/components/Banner";

export const getStaticProps: GetStaticProps = async () => {
  const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_KEY,
  });
  const { currentFeed, historyFeed } = await getFeed(airtable);
  const banner = await getBanner(airtable);
  return {
    props: {
      currentFeed,
      historyFeed,
      banner,
    },
  };
};

type Props = {
  currentFeed: FeedItem[];
  historyFeed: FeedItem[];
  banner: BannerData | null;
};

export default function Home({ currentFeed, historyFeed, banner }: Props) {
  return (
    <>
      {banner && <Banner {...banner} className={styles.banner} />}
      <SingleColumn header footer>
        {/* <Content /> */}
        <hr />
        {/* <section>
          <h2>What I'm up to</h2>
          <Feed feed={currentFeed} />
        </section>
        <hr /> */}
        <section>
          <h2>What I've been up to</h2>
          <Feed feed={historyFeed} />
        </section>
      </SingleColumn>
    </>
  );
}
