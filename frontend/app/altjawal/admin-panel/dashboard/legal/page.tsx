'use client';

import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import CmsEditor from '../../../../components/dashboard/CmsEditor';

export default function LegalCmsPage() {
  return (
    <DashboardLayout activePage="legal">
      <div className="db-page-header">
        <h2 className="db-page-title">Legal — CMS</h2>
      </div>
      <CmsEditor pageSlug="legal" />
    </DashboardLayout>
  );
}
