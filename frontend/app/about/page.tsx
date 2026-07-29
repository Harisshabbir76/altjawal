import AboutHeroSection from "../components/About-us/HeroSection";
import AboutExperienceSection from "../components/About-us/ExperienceSection";
import InspiredSection from "../components/About-us/InspiredSection";
import GuideSection from "../components/About-us/GuideSection";
import FounderSection from "../components/About-us/FounderSection";

export default function AboutPage() {
  return (
    <main>
      <AboutHeroSection />
      <AboutExperienceSection />
      <InspiredSection />
      <GuideSection />
      <FounderSection />
    </main>
  );
}
