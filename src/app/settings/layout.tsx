import Link from "next/link";
import { ReactNode } from "react";
import DashboardLayout from "../components/dashboard/dashboard";
import styles from './settings.module.css';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout>
      <div className={styles.settingsLayout}>
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            <Link href="/settings" className={styles.sidebarLink}>
              👤 Profile
            </Link>
            <Link href="/settings/security" className={styles.sidebarLink}>
              🔒 Security
            </Link>
          </nav>
        </aside>

        <section className={styles.content}>
          {children}
        </section>
      </div>
    </DashboardLayout>
  );
}