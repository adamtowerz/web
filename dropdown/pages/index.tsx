import React, { useState } from "react";
// import classNames from "classnames";
import Head from "next/head";

import styles from "../styles/Home.module.scss";
import { SmartDropdown } from "../components/Dropdown";
import ExternalLink from "../components/ExternalLink";
import { MenuItem } from "@/components/Menu";

const items: MenuItem[] = [
  { key: "a", label: "Item A" },
  { key: "b", label: "Item B" },
  { key: "c", label: "Item C" },
];

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>ajt.to/</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <SmartDropdown items={items} />
        </div>
        <p>
          Made by{" "}
          <ExternalLink
            href="https://twitter.com/adamtowerz"
            label="Adam"
          />
        </p>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
