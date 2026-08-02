import MainServicesHero from '../components/main-services/HeroSection';
import EventsSection from '../components/main-services/EventsSection';
import PackageSection from '../components/main-services/PackageSection';
import CmsModeActivator from '../components/CmsModeActivator';
import CmsApplierMainServices from '../components/CmsApplierMainServices';

export default function MainServicesPage() {
  return (
    <main>
      <CmsModeActivator />
      <CmsApplierMainServices />
      <MainServicesHero />
      <EventsSection />
      <PackageSection />
    </main>
  );
}
