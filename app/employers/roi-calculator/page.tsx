import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import EmployerROI from "@/components/tools/EmployerROI";

export default function ROICalculatorPage() {
  return (
    <>
      <Header cta={{ label: "Talk to us", href: "/employers#contact" }} />
      <main className="py-16 md:py-24">
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-8 text-[13px] text-muted">
            <Link href="/employers" className="hover:text-ink transition-colors">
              For employers
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink-2">ROI calculator</span>
          </nav>

          <EmployerROI />
        </Container>
      </main>
      <Footer />
    </>
  );
}
