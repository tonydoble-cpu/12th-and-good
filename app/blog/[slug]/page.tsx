import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { getPostBySlug, getAllPosts } from "@/lib/blog-posts";
import BlogEmailCapture from "./BlogEmailCapture";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return notFound();

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <article className="py-16 md:py-24">
        <Container width="narrow">
          {/* Breadcrumb */}
          <nav className="mb-8 text-[13px] text-muted">
            <Link
              href="/blog"
              className="hover:text-ink transition-colors"
            >
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink-2">{post.category}</span>
          </nav>

          {/* Title */}
          <header className="mb-10">
            <h1 className="font-display text-[32px] md:text-[42px] font-medium leading-[1.1] tracking-[-0.021em] text-ink">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center gap-4 text-[14px] text-muted">
              <span>{formattedDate}</span>
              <span className="text-line">|</span>
              <span>{post.readTime}</span>
            </div>
          </header>

          {/* Content */}
          <div
            className="prose-brand"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Email capture */}
          <div className="mt-14">
            <BlogEmailCapture slug={post.slug} />
          </div>

          {/* Related posts nav */}
          <div className="mt-14 flex items-center justify-between border-t border-line pt-8">
            <Link
              href="/blog"
              className="text-[14px] font-semibold text-accent hover:underline"
            >
              &larr; All posts
            </Link>
            <Link
              href="/coaches"
              className="inline-flex items-center gap-[9px] rounded-[9px] bg-accent px-[19px] py-[10px] text-sm font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover"
            >
              Find a coach <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </Container>
      </article>

      <Footer />
    </div>
  );
}
