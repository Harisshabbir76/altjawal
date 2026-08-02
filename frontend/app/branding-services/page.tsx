import BrandingServicesHero from '../components/branding-services/HeroSection';
import LogoSection from '../components/branding-services/LogoSection';
import BrandingSection from '../components/branding-services/BrandingSection';
import CmsModeActivator from '../components/CmsModeActivator';
import CmsApplierBranding from '../components/CmsApplierBranding';

export default function BrandingServicesPage() {
  return (
    <main>
      <CmsModeActivator />
      <CmsApplierBranding />
      <BrandingServicesHero />
      <LogoSection />
      <BrandingSection />
    </main>
  );
}
