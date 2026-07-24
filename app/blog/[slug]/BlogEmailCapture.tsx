"use client";

import EmailCapture from "@/components/EmailCapture";

export default function BlogEmailCapture({ slug }: { slug: string }) {
  return (
    <EmailCapture
      heading="Get more like this"
      valueProp="Practical advice on money, coaching, and benefits — written for real people, not finance bros. No spam."
      source={`blog-${slug}`}
    />
  );
}
