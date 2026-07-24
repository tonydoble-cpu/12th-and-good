import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import WellnessAssessment from "@/components/tools/WellnessAssessment";

export default function WellnessAssessmentPage() {
  return (
    <>
      <Header />
      <main className="py-16 md:py-24">
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-8 text-[13px] text-muted">
            <Link href="/resources" className="hover:text-ink transition-colors">
              Resources
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink-2">Financial wellness checkup</span>
          </nav>

          <WellnessAssessment />
        </Container>
      </main>
      <Footer />
    </>
  );
}
