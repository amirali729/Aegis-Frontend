import { LandingNavbar } from "@/features/landing/sections/landing-navbar";
import { HeroSection } from "@/features/landing/sections/hero-section";
import { TrustedSection } from "@/features/landing/sections/trusted-section";
import { FeaturesSection } from "@/features/landing/sections/features-section";
import { DeveloperExperienceSection } from "@/features/landing/sections/developer-experience-section";
import { HowItWorksSection } from "@/features/landing/sections/how-it-works-section";
import { DashboardPreviewSection } from "@/features/landing/sections/dashboard-preview-section";
import { SecuritySection } from "@/features/landing/sections/security-section";
import { FaqSection } from "@/features/landing/sections/faq-section";
import { CtaSection } from "@/features/landing/sections/cta-section";
import { FooterSection } from "@/features/landing/sections/footer-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main>
        <HeroSection />
        <TrustedSection />
        <FeaturesSection />
        <DeveloperExperienceSection />
        <HowItWorksSection />
        <DashboardPreviewSection />
        <SecuritySection />
        <FaqSection />
        <CtaSection />
      </main>
      <FooterSection />
    </div>
  );
}