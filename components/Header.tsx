import Link from "next/link";
import Container from "./Container";

export default function Header() {
  return (
    <header className="border-b border-border-subtle bg-surface/80 backdrop-blur sticky top-0 z-40">
      <Container className="flex items-center justify-between py-4">
        <Link
          href="/"
          className="font-display font-semibold text-lg text-foreground tracking-tight"
        >
          The Marketplace
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-foreground-secondary">
          <Link href="/tony" className="hover:text-foreground transition-colors">
            Meet Tony
          </Link>
          <Link href="/account" className="hover:text-foreground transition-colors">
            My Account
          </Link>
          <Link
            href="/tony"
            className="rounded-full bg-primary px-4 py-2 text-white hover:bg-primary-dark transition-colors"
          >
            Book a Session
          </Link>
        </nav>
      </Container>
    </header>
  );
}
