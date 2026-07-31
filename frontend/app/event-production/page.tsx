import EventProductionHero from '../components/event-production/HeroSection';
import CreativitySection from '../components/event-production/CreativitySection';
import EPMarqueeSection from '../components/event-production/MarqueeSection';
import WorkingSection from '../components/event-production/WorkingSection';

export default function EventProductionPage() {
  return (
    <main>
      <EventProductionHero />
      <CreativitySection />
      <EPMarqueeSection />
      <WorkingSection />
    </main>
  );
}
