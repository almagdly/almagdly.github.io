import React from 'react';
import { SignOut, ArrowSquareOut, List, Bell, ShieldCheck } from '@phosphor-icons/react';
import { adminStore } from '../../services/adminStore';

interface Props {
  onToggleSidebar: () => void;
  unreadInquiriesCount: number;
  onSelectInquiriesTab: () => void;
}

export const AdminHeader: React.FC<Props> = ({
  onToggleSidebar,
  unreadInquiriesCount,
  onSelectInquiriesTab,
}) => {
  const handleLogout = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة التحكم؟')) {
      adminStore.logout();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-brand-surface/95 backdrop-blur-md border-b border-brand-gold/20 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
      {/* Right Side: Brand & Mobile Toggle */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-black/40 text-brand-gold hover:bg-brand-gold/10 transition-colors"
          aria-label="القائمة الجانبية"
        >
          <List size={22} weight="bold" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-gold to-amber-600 flex items-center justify-center text-brand-dark font-bold text-xs shadow-sm">
            <ShieldCheck size={20} weight="bold" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-brand-ivory leading-tight font-arabic">
              إدارة شركة المجد
            </h1>
            <span className="text-[10px] text-brand-gold font-medium">لوحة التحكم المركزية</span>
          </div>
        </div>
      </div>

      {/* Left Side: Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification Bell */}
        <button
          onClick={onSelectInquiriesTab}
          className="relative p-2.5 rounded-xl bg-black/40 border border-brand-gold/20 text-brand-ivory/80 hover:text-brand-gold hover:border-brand-gold/40 transition-all"
          title="طلبات العملاء الجديدة"
        >
          <Bell size={19} weight="duotone" />
          {unreadInquiriesCount > 0 && (
            <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg animate-pulse">
              {unreadInquiriesCount}
            </span>
          )}
        </button>

        {/* View Live Website */}
        <a
          href="#/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-black/40 border border-brand-gold/30 text-brand-champagne hover:bg-brand-gold/10 transition-colors"
        >
          <span>زيارة الموقع</span>
          <ArrowSquareOut size={15} />
        </a>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-colors"
          title="تسجيل الخروج"
        >
          <SignOut size={16} weight="bold" />
          <span className="hidden sm:inline">خروج</span>
        </button>
      </div>
    </header>
  );
};
