import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { getAllPosts } from "@/lib/blog-posts";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Employers: { bg: "bg-blue-50", text: "text-blue-700" },
  Individuals: { bg: "bg-emerald-50", text: "text-emerald-700" },
  Industry: { bg: "bg-amber-50", text: "text-amber-700" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <header className="pt-20 pb-6">
        <Container width="narrow">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#dde5ec] bg-accent-tint px-[14px] py-[7px] text-[12.5px] font-medium text-ink-2 mb-5">
            <span className="dot" />
            Perspectives on money, coaching &amp; work
          </div>
          <h1 className="font-display text-[36px] md:text-[50px] font-normal leading-[1.04] tracking-[-0.021em] text-ink">
            Blog
          </h1>
          <p className="mt-5 max-w-[560px] text-[18px] md:text-[20px] leading-[1.55] tracking-[-0.008em] text-ink-2">
            Ideas, research, and practical advice on financial wellness —
            for individuals and the companies that employ them.
          </p>
        </Container>
      </header>

      <section className="py-14">
        <Container width="narrow">
          <div className="flex flex-col gap-8">
            {posts.map((post, idx) => {
              const colors = CATEGORY_COLORS[post.category] || {
                bg: "bg-gray-50",
                text: "text-gray-700",
              };
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-2xl border border-line bg-surface p-8 text-inherit no-underline transition-all duration-[240ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:-translate-y-[3px] hover:border-[#dcd8cf] hover:shadow-[0_26px_54px_-30px_rgba(20,30,45,0.42)]"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`rounded-full px-[10px] py-[3px] text-[11.5px] font-semibold uppercase tracking-[0.12em] ${colors.bg} ${colors.text}`}
                    >
                      {post.category}
                    </span>
                    <span className="text-[13px] text-muted">
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="font-display text-[22px] md:text-[26px] font-medium leading-tight text-ink group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
                    {post.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-[6px] text-[14px] font-semibold text-accent">
                    Read more <span aria-hidden>&rarr;</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
