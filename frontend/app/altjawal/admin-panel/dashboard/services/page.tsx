'use client';

import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import CmsEditor from '../../../../components/dashboard/CmsEditor';

export default function ServicesCmsPage() {
  return (
    <DashboardLayout activePage="services">
      <div className="db-page-header">
        <h2 className="db-page-title">Main Services — CMS</h2>
      </div>
      <CmsEditor pageSlug="services" />
    </DashboardLayout>
  );
}
