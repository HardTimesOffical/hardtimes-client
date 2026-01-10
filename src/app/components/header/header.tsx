import React from "react";
import styles from "./header.module.css";
import { HeaderBalance } from "./HeaderBalance";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
        </div>
        <div className={styles.right}>
          <HeaderBalance/>
        </div>
      </div>
    </header>
  );
}
