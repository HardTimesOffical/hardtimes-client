"use client";

import AuthButtons from "./AuthButtons";
import UserCard from "./UserCard";
import styles from "./dashboard.module.css";

export default function AuthSlot() {
  return (
    <div className={styles.profileWrap}>
      <AuthButtons />
      <UserCard />
    </div>
  );
}
