import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import DayInTheLife from "@/components/landing/day-in-the-life";
import PeopleSection from "@/components/landing/people-section";
import ImpactCalculator from "@/components/landing/impact-calculator";
import Steps from "@/components/landing/steps";
import Audiences from "@/components/landing/audiences";
import Stories from "@/components/landing/stories";
import Faq from "@/components/landing/faq";
import Cta from "@/components/landing/cta";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream font-sans text-ink selection:bg-sun/60">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <DayInTheLife />
        <PeopleSection />
        <ImpactCalculator />
        <Steps />
        <Audiences />
        <Stories />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
