import FaqHeroSection from "../components/Faq/HeroSection";
import FaqQASection from "../components/Faq/QASection";
import CmsModeActivator from "../components/CmsModeActivator";
import CmsApplierFaq from "../components/CmsApplierFaq";

export default function FaqPage() {
  return (
    <main>
      <CmsModeActivator />
      <CmsApplierFaq />
      <FaqHeroSection />
      <FaqQASection />
    </main>
  );
}
