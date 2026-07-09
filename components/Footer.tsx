import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-surface">
      <Container className="py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="font-display font-semibold text-foreground">
            The Marketplace
          </p>
          <p className="text-sm text-foreground-secondary mt-1 max-w-md">
            Nothing to sell. No products. No commission. Financial coaching
            you can actually trust.
          </p>
        </div>
        <p className="text-xs text-foreground-tertiary">
          This is financial coaching and planning education — not
          individualized investment advice. &copy;{" "}
          {new Date().getFullYear().toString()} The Marketplace.
        </p>
      </Container>
    </footer>
  );
}
