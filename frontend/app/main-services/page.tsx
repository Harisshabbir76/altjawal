import MainServicesHero from '../components/main-services/HeroSection';
import EventsSection from '../components/main-services/EventsSection';
import PackageSection from '../components/main-services/PackageSection';

export default function MainServicesPage() {
  return (
    <main>
      <MainServicesHero />
      <EventsSection />
      <PackageSection />
    </main>
  );
}
