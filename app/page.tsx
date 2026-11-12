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

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#040e0f] font-sans text-ink dark:text-slate-100 antialiased overflow-x-hidden selection:bg-emerald-500/30 transition-colors duration-300">
      {/* Aurora Gradient Background strictly from Sample 2 */}
      <div className="aurora-bg" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content Sections arranged strictly per Sample 1 */}
      <main className="relative z-10">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Trust Bar */}
        <TrustBar />

        {/* 3. Features (Before & After) */}
        <BeforeAfter />

        {/* 4. Solutions (Role-Based Tabs) */}
        <RoleTabs />

        {/* 5. Offline Feature Spotlight */}
        <OfflineSpotlight />

        {/* 6. Impact / Measurable ROI Stats */}
        <ImpactStats />

        {/* 7. Loved By Caregivers (Testimonials) */}
        <Testimonials />

        {/* 8. FAQ Accordion */}
        <Faq />

        {/* 9. Final Call to Action */}
        <Cta />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
