import HeroSection from "./components/homepage/HeroSection";
import VisionSection from "./components/homepage/VisionSection";
import TraditionSection from "./components/homepage/TraditionSection";
import ServicesSection from "./components/homepage/ServicesSection";
import ChooseUsSection from "./components/homepage/ChooseUsSection";
import ExperienceSection from "./components/homepage/ExperienceSection";
import MarqueeSection from "./components/homepage/MarqueeSection";
import PurposeSection from "./components/homepage/PurposeSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <VisionSection />
      <TraditionSection />
      <ServicesSection />
      <ChooseUsSection />
      <ExperienceSection />
      <MarqueeSection />
      <PurposeSection />
    </main>
  );
}
