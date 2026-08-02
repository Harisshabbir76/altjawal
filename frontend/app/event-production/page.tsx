import EventProductionHero from '../components/event-production/HeroSection';
import CreativitySection from '../components/event-production/CreativitySection';
import EPMarqueeSection from '../components/event-production/MarqueeSection';
import WorkingSection from '../components/event-production/WorkingSection';
import CmsModeActivator from '../components/CmsModeActivator';
import CmsApplierEventProd from '../components/CmsApplierEventProd';

export default function EventProductionPage() {
  return (
    <main>
      <CmsModeActivator />
      <CmsApplierEventProd />
      <EventProductionHero />
      <CreativitySection />
      <EPMarqueeSection />
      <WorkingSection />
    </main>
  );
}
