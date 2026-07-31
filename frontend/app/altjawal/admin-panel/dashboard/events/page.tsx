'use client';

import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import CmsEditor from '../../../../components/dashboard/CmsEditor';

export default function EventsCmsPage() {
  return (
    <DashboardLayout activePage="events">
      <div className="db-page-header">
        <h2 className="db-page-title">Event Production — CMS</h2>
      </div>
      <CmsEditor pageSlug="events" />
    </DashboardLayout>
  );
}
