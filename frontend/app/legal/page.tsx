'use client';

import { useState } from 'react';
import '../styles/legal/legal.css';

const tabs = ['PRIVACY POLICY', 'TERMS & CONDITIONS', 'COOKIE POLICY'] as const;
type Tab = typeof tabs[number];

const content: Record<Tab, React.ReactNode> = {
  'PRIVACY POLICY': (
    <>
      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Your Privacy Matters</h3>
        <p>At AlTjawal, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or engage with our services.</p>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Information We Collect</h3>
        <p>We may collect information you voluntarily provide, including:</p>
        <ul>
          <li>Full Name</li>
          <li>Email Address</li>
          <li>Phone Number</li>
          <li>Company Name (if applicable)</li>
          <li>Event Details</li>
          <li>Messages submitted through our contact forms</li>
        </ul>
        <br />
        <p>We may also collect technical information such as:</p>
        <ul>
          <li>IP Address</li>
          <li>Browser Type</li>
          <li>Device Information</li>
          <li>Website Usage Data</li>
          <li>Cookies and Analytics Information</li>
        </ul>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">How We Use Your Information</h3>
        <p>Your information helps us:</p>
        <ul>
          <li>Respond to your inquiries</li>
          <li>Prepare quotations and proposals</li>
          <li>Deliver our event management services</li>
          <li>Improve our website and user experience</li>
          <li>Send relevant updates regarding your inquiry</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>We never sell your personal information.</p>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Information Sharing</h3>
        <p>We only share your information when necessary, including:</p>
        <ul>
          <li>Trusted vendors involved in delivering your event</li>
          <li>Service providers supporting our website</li>
          <li>Legal authorities where required by law</li>
        </ul>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Data Security</h3>
        <p>We implement appropriate security measures to protect your information against unauthorized access, misuse, or disclosure. While no online system is completely secure, we continuously work to safeguard your personal data.</p>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Your Rights</h3>
        <p>You may request to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your data</li>
          <li>Withdraw your consent where applicable</li>
        </ul>
        <p>To make a request, please contact us directly.</p>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Third-Party Links</h3>
        <p>Our website may include links to external websites or social media platforms. We are not responsible for the privacy practices of third-party websites.</p>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Policy Updates</h3>
        <p>This Privacy Policy may be updated periodically. Changes become effective once published on this page.</p>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Contact</h3>
        <p>If you have any questions regarding this Privacy Policy, please contact us.</p>
      </div>
    </>
  ),

  'TERMS & CONDITIONS': (
    <>
      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Acceptance of Terms</h3>
        <p>By accessing or using the AlTjawal website, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our website or services.</p>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Our Services</h3>
        <p>AlTjawal provides event management and planning services across the UAE. All services are subject to availability and separate service agreements between AlTjawal and the client.</p>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Intellectual Property</h3>
        <p>All content on this website — including text, images, graphics, logos, and designs — is the property of AlTjawal and is protected under applicable copyright and intellectual property laws. You may not reproduce or distribute any content without prior written permission.</p>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">User Conduct</h3>
        <p>When using our website or contacting us, you agree not to:</p>
        <ul>
          <li>Submit false or misleading information</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Use the website for any unlawful purpose</li>
          <li>Disrupt or interfere with the functioning of our website</li>
        </ul>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Limitation of Liability</h3>
        <p>AlTjawal is not liable for any indirect, incidental, or consequential damages arising from the use of our website or services. We make no warranties regarding the accuracy or completeness of the information provided on this site.</p>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Bookings & Payments</h3>
        <p>All event bookings are subject to a formal agreement and deposit. Cancellation and refund terms are outlined in your individual service contract. AlTjawal reserves the right to decline any booking at its discretion.</p>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Governing Law</h3>
        <p>These Terms & Conditions are governed by the laws of the United Arab Emirates. Any disputes shall be subject to the jurisdiction of the courts in the UAE.</p>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Changes to Terms</h3>
        <p>We reserve the right to update these Terms & Conditions at any time. Continued use of the website after changes are posted constitutes acceptance of the revised terms.</p>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Contact</h3>
        <p>For any questions regarding these Terms & Conditions, please reach out to us through our contact page.</p>
      </div>
    </>
  ),

  'COOKIE POLICY': (
    <>
      <div className="legal-page__section">
        <h3 className="legal-page__section-title">What Are Cookies</h3>
        <p>Cookies are small text files stored on your device when you visit a website. They help us understand how visitors interact with our site and improve your browsing experience.</p>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">How We Use Cookies</h3>
        <p>AlTjawal uses cookies for the following purposes:</p>
        <ul>
          <li>Essential cookies to ensure the website functions correctly</li>
          <li>Analytics cookies to understand visitor behaviour and improve our site</li>
          <li>Preference cookies to remember your settings and choices</li>
        </ul>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Third-Party Cookies</h3>
        <p>We may use third-party services such as Google Analytics that place their own cookies on your device. These are governed by the respective third party's privacy and cookie policies.</p>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Managing Cookies</h3>
        <p>You can control or disable cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our website. Refer to your browser's help documentation for instructions on managing cookies.</p>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Consent</h3>
        <p>By continuing to use our website, you consent to the use of cookies as described in this policy. If you do not agree, please adjust your browser settings or refrain from using our website.</p>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Policy Updates</h3>
        <p>This Cookie Policy may be updated from time to time. Any changes will be posted on this page and take effect immediately upon publication.</p>
      </div>

      <div className="legal-page__section">
        <h3 className="legal-page__section-title">Contact</h3>
        <p>If you have questions about our use of cookies, please contact us through our contact page.</p>
      </div>
    </>
  ),
};

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<Tab>('PRIVACY POLICY');

  return (
    <div className="legal-page">
      <div className="legal-page__header">
        <h1 className="legal-page__title">Legal</h1>
        <p className="legal-page__subtitle">
          Creating thoughtful visual identities that tell your story, strengthen your presence, and leave a lasting impression.
        </p>
      </div>

      <div className="legal-page__card">
        <div className="legal-page__tabs">
          {tabs.map((tab, i) => (
            <span key={tab} style={{ display: 'contents' }}>
              <button
                className={`legal-page__tab${activeTab === tab ? ' legal-page__tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
              {i < tabs.length - 1 && (
                <span className="legal-page__tab-dot">•</span>
              )}
            </span>
          ))}
        </div>

        <div className="legal-page__content">
          {content[activeTab]}
        </div>
      </div>
    </div>
  );
}
