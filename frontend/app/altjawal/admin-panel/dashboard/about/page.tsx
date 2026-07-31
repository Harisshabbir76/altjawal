'use client';

import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import CmsEditor from '../../../../components/dashboard/CmsEditor';

export default function AboutCmsPage() {
  return (
    <DashboardLayout activePage="about">
      <div className="db-page-header">
        <h2 className="db-page-title">About Us — CMS</h2>
      </div>
      <CmsEditor pageSlug="about" />
    </DashboardLayout>
  );
}
