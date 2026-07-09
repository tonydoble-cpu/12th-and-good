import Link from "next/link";
import { formatPrice, type SessionType } from "@/lib/types";

export default function SessionTypeCard({
  sessionType,
}: {
  sessionType: SessionType;
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-6 flex flex-col">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display font-semibold text-lg text-foreground">
          {sessionType.name}
        </h3>
        <span className="font-display font-semibold text-lg text-primary shrink-0">
          {formatPrice(sessionType.price_cents)}
        </span>
      </div>
      <p className="text-sm text-foreground-secondary mt-2 leading-relaxed flex-1">
        {sessionType.description}
      </p>
      <p className="text-xs text-foreground-tertiary mt-4">
        {sessionType.duration_minutes} minutes &middot; video session
      </p>
      <Link
        href={`/book?session=${sessionType.id}`}
        className="mt-5 inline-flex items-center justify-center rounded-full bg-accent text-white px-5 py-2.5 text-sm font-medium hover:bg-accent-dark transition-colors"
      >
        Book this session
      </Link>
    </div>
  );
}
