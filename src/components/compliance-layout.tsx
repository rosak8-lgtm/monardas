import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./compliance-layout.module.css";

export { styles };

export function CompliancePage({
  label, title, description, children,
}: {
  label: string; title: string; description: string; children: ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <header className={styles.hero}>
        <p className={styles.kicker}>{label}</p>
        <h1>{title}</h1>
        <p className={styles.lead}>{description}</p>
        <p className={styles.meta}>Operated by Individual Entrepreneur Iurii Shalygin · Georgia · Updated 20 November 2026</p>
      </header>
      <div className={styles.content}>{children}</div>
      <nav className={styles.nav} aria-label="Commercial and legal information">
        <Link href="/pricing">Pricing</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/refund-policy">Refunds</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </div>
  );
}
