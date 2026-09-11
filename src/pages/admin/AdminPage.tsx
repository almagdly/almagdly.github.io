import React, { useState } from 'react';
import { useAdminDesigns, useAdminInquiries, useSiteSettings, useIsAdmin } from '../../hooks/useAdminStore';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminSidebar, AdminTab } from '../../components/admin/AdminSidebar';
import { AdminOverviewTab } from '../../components/admin/tabs/AdminOverviewTab';
import { AdminDesignsTab } from '../../components/admin/tabs/AdminDesignsTab';
import { AdminInquiriesTab } from '../../components/admin/tabs/AdminInquiriesTab';
import { AdminSettingsTab } from '../../components/admin/tabs/AdminSettingsTab';
import { AdminBackupTab } from '../../components/admin/tabs/AdminBackupTab';
import { AdminDesignModal } from '../../components/admin/tabs/AdminDesignModal';

export const AdminPage: React.FC = () => {
  const isAuth = useIsAdmin();
  const designs = useAdminDesigns();
  const inquiries = useAdminInquiries();
  const settings = useSiteSettings();

  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // If not logged in, show sleek login gatekeeper
  if (!isAuth) {
    return <AdminLoginPage onLoginSuccess={() => setCurrentTab('overview')} />;
  }

  const unreadInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div className="min-h-screen bg-brand-dark text-brand-ivory flex flex-col font-arabic selection:bg-brand-gold selection:text-brand-dark">
      {/* Top Header */}
      <AdminHeader
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        unreadInquiriesCount={unreadInquiriesCount}
        onSelectInquiriesTab={() => setCurrentTab('inquiries')}
      />

      {/* Main Layout (Sidebar + Content) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar
          currentTab={currentTab}
          onSelectTab={tab => setCurrentTab(tab)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          unreadInquiriesCount={unreadInquiriesCount}
          totalDesignsCount={designs.length}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'overview' && (
              <AdminOverviewTab
                designs={designs}
                inquiries={inquiries}
                onNavigateTab={tab => setCurrentTab(tab)}
                onOpenAddModal={() => setIsAddModalOpen(true)}
              />
            )}

            {currentTab === 'designs' && <AdminDesignsTab designs={designs} />}

            {currentTab === 'inquiries' && <AdminInquiriesTab inquiries={inquiries} />}

            {currentTab === 'settings' && <AdminSettingsTab settings={settings} />}

            {currentTab === 'backup' && <AdminBackupTab />}
          </div>
        </main>
      </div>

      {/* Quick Add Modal */}
      <AdminDesignModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        designToEdit={null}
        onSaveSuccess={() => {}}
      />
    </div>
  );
};
