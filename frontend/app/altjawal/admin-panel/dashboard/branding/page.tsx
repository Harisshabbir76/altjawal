'use client';

import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import CmsEditor from '../../../../components/dashboard/CmsEditor';

export default function BrandingCmsPage() {
  return (
    <DashboardLayout activePage="branding">
      <div className="db-page-header">
        <h2 className="db-page-title">Branding Services — CMS</h2>
      </div>
      <CmsEditor pageSlug="branding" />
    </DashboardLayout>
  );
}
