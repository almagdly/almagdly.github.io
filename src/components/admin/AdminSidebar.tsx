import React from 'react';
import {
  ChartPieSlice,
  Images,
  ChatTeardropDots,
  Gear,
  Database,
  X,
  House,
  ShieldCheck,
  ArrowsHorizontal,
  Star,
} from '@phosphor-icons/react';

export type AdminTab =
  | 'overview'
  | 'designs'
  | 'homepage'
  | 'before-after'
  | 'inquiries'
  | 'settings'
  | 'backup';

interface Props {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  unreadInquiriesCount: number;
  totalDesignsCount: number;
}

export const AdminSidebar: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  unreadInquiriesCount,
  totalDesignsCount,
}) => {
  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'overview',
      label: 'نظرة عامة وإحصائيات',
      icon: <ChartPieSlice size={20} weight="duotone" />,
    },
    {
      id: 'designs',
      label: 'إدارة كافة التصاميم',
      icon: <Images size={20} weight="duotone" />,
      badge: totalDesignsCount,
    },
    {
      id: 'homepage',
      label: 'صور الصفحة الرئيسية',
      icon: <Star size={20} weight="duotone" />,
    },
    {
      id: 'before-after',
      label: 'مشاريع (قبل و بعد)',
      icon: <ArrowsHorizontal size={20} weight="duotone" />,
    },
    {
      id: 'inquiries',
      label: 'طلبات واستفسارات العملاء',
      icon: <ChatTeardropDots size={20} weight="duotone" />,
      badge: unreadInquiriesCount > 0 ? `${unreadInquiriesCount} جديد` : undefined,
    },
    {
      id: 'settings',
      label: 'إعدادات الموقع والتواصل',
      icon: <Gear size={20} weight="duotone" />,
    },
    {
      id: 'backup',
      label: 'النسخ الاحتياطي وتصدير البيانات',
      icon: <Database size={20} weight="duotone" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 w-72 bg-brand-surface border-l border-brand-gold/20 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-brand-gold/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold to-amber-600 flex items-center justify-center text-brand-dark shadow-md">
              <ShieldCheck size={24} weight="bold" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-ivory font-arabic">لوحة التحكم</h2>
              <p className="text-[11px] text-brand-gold">شركة المجد - البيضاء</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-brand-ivory/60 hover:text-brand-ivory hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-l from-brand-gold/20 via-brand-gold/15 to-transparent text-brand-gold border-r-4 border-brand-gold shadow-sm'
                    : 'text-brand-ivory/70 hover:text-brand-ivory hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-brand-gold' : 'text-brand-ivory/60'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      typeof item.badge === 'string' && item.badge.includes('جديد')
                        ? 'bg-rose-500 text-white animate-pulse'
                        : isActive
                        ? 'bg-brand-gold text-brand-dark'
                        : 'bg-black/40 text-brand-ivory/70 border border-brand-gold/20'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-brand-gold/15 space-y-2">
          <a
            href="#/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-black/40 border border-brand-gold/20 text-brand-champagne hover:bg-brand-gold/10 hover:border-brand-gold/40 transition-all"
          >
            <House size={16} weight="duotone" />
            <span>الصفحة الرئيسية للموقع</span>
          </a>
          <div className="text-center pt-1">
            <span className="text-[10px] text-brand-ivory/40">نسخة النظام v2.4 • 2026</span>
          </div>
        </div>
      </aside>
    </>
  );
};
