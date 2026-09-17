import React, { useState } from 'react';
import { SignOut, ArrowSquareOut, List, Bell, ShieldCheck, CloudArrowUp, CircleNotch, CheckCircle } from '@phosphor-icons/react';
import { adminStore } from '../../services/adminStore';
import { githubSync } from '../../services/githubSync';

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
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const handleLogout = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة التحكم؟')) {
      adminStore.logout();
    }
  };

  const handlePublishToGitHub = async () => {
    setIsPublishing(true);
    setPublishMessage(null);
    try {
      const res = await githubSync.publishToGitHub();
      setPublishSuccess(res.success);
      setPublishMessage(res.message);
      if (res.success) {
        setTimeout(() => setPublishMessage(null), 6000);
      }
    } catch (err: any) {
      setPublishSuccess(false);
      setPublishMessage(err.message || 'فشلت المزامنة مع GitHub');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-brand-surface/95 backdrop-blur-md border-b border-brand-gold/20 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
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

      {/* Left Side: Actions & GitHub Sync */}
      <div className="flex items-center flex-wrap gap-2 sm:gap-3">
        {/* Sync / Publish to GitHub Button */}
        <button
          onClick={handlePublishToGitHub}
          disabled={isPublishing}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
            isPublishing
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/30 active:scale-95'
          }`}
          title="نشر وحفظ التعديلات فوراً إلى مستودع GitHub والموقع الحي"
        >
          {isPublishing ? (
            <>
              <CircleNotch size={16} className="animate-spin" />
              <span>جاري النشر للمستودع...</span>
            </>
          ) : (
            <>
              <CloudArrowUp size={18} weight="bold" />
              <span>نشر التعديلات للمستودع والموقع</span>
            </>
          )}
        </button>

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
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-colors"
          title="تسجيل الخروج"
        >
          <SignOut size={16} weight="bold" />
          <span className="hidden sm:inline">خروج</span>
        </button>
      </div>

      {/* Publish Feedback Message Banner */}
      {publishMessage && (
        <div
          className={`w-full p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 border transition-all ${
            publishSuccess
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {publishSuccess && <CheckCircle size={16} weight="fill" className="text-emerald-400 shrink-0" />}
            <span>{publishMessage}</span>
          </div>
          <button
            onClick={() => setPublishMessage(null)}
            className="text-[11px] font-bold underline opacity-70 hover:opacity-100"
          >
            إغلاق
          </button>
        </div>
      )}
    </header>
  );
};
