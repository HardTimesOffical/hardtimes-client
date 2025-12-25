"use client";
import React, { PropsWithChildren, useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import styles from "./dashboard.module.css";
import AuthSlot from "./AuthSlot";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: PropsWithChildren) {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	return (
		<div className={`${styles.container} min-h-screen`}> 
			<button
				className={`${styles.hamburger} ${open ? styles.hidden : ""}`}
				onClick={() => setOpen(true)}
				aria-label="Open menu"
			>
				<span />
				<span />
				<span />
			</button>

			<aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
				<div className={styles.logoWrap}>
					<Link className={styles.brand} href="/"><img src="/icons/logo.svg" alt="Logo" /></Link>
					<button
						className={styles.closeBtn}
						onClick={() => setOpen(false)}
						aria-label="Close menu"
					>
						×
					</button>
				</div>

				<div className={styles.buttonsWrap}>
					<nav className={styles.nav}>
						<div className={styles.sectionTitle}>GENERAL</div>
						<Link
							className={`${styles.navItem} ${
								pathname === "/servers/java" ? styles.navItemActive : ""
							}`}
							href="/servers/java"
						>						
						<img className="w-6" src="/icons/java.svg" alt="Java" />
							Java
						  </Link>

						  <Link
							className={`${styles.navItem} ${
								pathname === "/servers/bedrock" ? styles.navItemActive : ""
							}`}
							href="/servers/bedrock"
						>
						<img className="w-6" src="/icons/bedrock.svg" alt="Bedrock" />
							Bedrock
						  </Link>

						<div className={styles.sectionTitle}>INFO</div>
					</nav>
                </div>
					<div className={styles.dashboardmodule}>
						<div className={styles.actions}>
                            <AuthSlot />
					    </div>
                    </div>
			</aside>

			{/* overlay for mobile when sidebar is open */}
			<div
				className={`${styles.overlay} ${open ? styles.show : ""}`}
				onClick={() => setOpen(false)}
			/>

			<main className={`${styles.main} flex-1 p-7`}>
				<div className={styles.content}>{children}</div>
			</main>
		</div>
	);
}
