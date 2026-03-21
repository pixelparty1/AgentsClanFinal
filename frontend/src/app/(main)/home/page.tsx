import Hero from "@/components/Hero";
import SocialProofBar from "@/components/sections/SocialProofBar";
import TrustedBySection from "@/components/sections/TrustedBySection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import MentorSection from "@/components/sections/MentorSection";
import CommunityTestimonials from "@/components/sections/CommunityTestimonials";
import StatsSection from "@/components/sections/StatsSection";
import ServicesPreviewSection from "@/components/sections/ServicesPreviewSection";
import GlobeDemo from "@/components/globe-demo";
import MembershipCTASection from "@/components/sections/MembershipCTASection";

export default function Home() {
  return (
    <main>
      <Hero />
      <SocialProofBar />
      <TrustedBySection />
      <FeaturesSection />
      <MentorSection />
      <CommunityTestimonials />
      <StatsSection />
      <ServicesPreviewSection />
      <GlobeDemo />
      <MembershipCTASection />
    </main>
  );
}
