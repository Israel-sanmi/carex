import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import TrustBar from "@/components/landing/trust-bar";
import BeforeAfter from "@/components/landing/before-after";
import RoleTabs from "@/components/landing/role-tabs";
import OfflineSpotlight from "@/components/landing/offline-spotlight";
import ImpactStats from "@/components/landing/impact-stats";
import Testimonials from "@/components/landing/testimonials";
import Faq from "@/components/landing/faq";
import Cta from "@/components/landing/cta";
import Footer from "@/components/landing/footer";
import Reveal from "@/components/landing/reveal";
import Bento from "@/components/landing/bento";
import HowItWorks from "@/components/landing/how-it-works";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#040e0f] font-sans text-ink dark:text-slate-100 antialiased overflow-x-clip selection:bg-emerald-500/30 transition-colors duration-300">
      {/* Ambient background layers */}
      <div className="aurora-bg" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[900px] bg-grid z-0" aria-hidden="true" />

      <Navbar />

      <main className="relative z-10">
        <Hero />

        <Reveal>
          <TrustBar />
        </Reveal>

        <Reveal>
          <BeforeAfter />
        </Reveal>

        <Reveal>
          <Bento />
        </Reveal>

        <Reveal>
          <RoleTabs />
        </Reveal>

        <Reveal from="scale">
          <OfflineSpotlight />
        </Reveal>

        <HowItWorks />

        <Reveal>
          <ImpactStats />
        </Reveal>

        <Reveal>
          <Testimonials />
        </Reveal>

        <Reveal>
          <Faq />
        </Reveal>

        <Reveal from="scale">
          <Cta />
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
