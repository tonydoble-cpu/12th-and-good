import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import EmergencyFund from "@/components/tools/EmergencyFund";

export default function Page() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1 py-16 md:py-20">
        <Container>
          <div className="mb-8 text-[13px] text-muted">
            <a href="/resources" className="text-muted no-underline hover:text-ink-2">Resources</a>
            &nbsp;/&nbsp;
            <span className="text-ink-2">Emergency fund calculator</span>
          </div>
          <EmergencyFund />
        </Container>
      </main>
      <Footer />
    </div>
  );
}
