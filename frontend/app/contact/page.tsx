import ContactSection from "../components/contactus/ContactSection";
import CmsModeActivator from "../components/CmsModeActivator";
import CmsApplierContact from "../components/CmsApplierContact";

export default function ContactPage() {
  return (
    <main>
      <CmsModeActivator />
      <CmsApplierContact />
      <ContactSection />
    </main>
  );
}
