import React from 'react';
import styles from './LoadingCrystal.module.css';

export default function LoadingCrystal() {
  return (
    <div className={styles.overlay}>
      <div className={styles.scene}>
        {/* Орбиты с осколками */}
        <div className={`${styles.orbit} ${styles.orbit1}`}>
          <div className={styles.shard}></div>
        </div>
        <div className={`${styles.orbit} ${styles.orbit2}`}>
          <div className={styles.shard}></div>
        </div>
        
        {/* Центральный кристалл */}
        <div className={styles.crystalContainer}>
          <div className={styles.crystal}>
            <div className={styles.innerGlow}></div>
          </div>
        </div>
        
        <div className={styles.shadow}></div>
      </div>
      <span className={styles.text}>Loading...</span>
    </div>
  );
}