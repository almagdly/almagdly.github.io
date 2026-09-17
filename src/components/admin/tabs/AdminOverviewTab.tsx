import React from 'react';
import {
  Images,
  ChatTeardropDots,
  Eye,
  Star,
  PlusCircle,
  WhatsappLogo,
  ArrowUpRight,
  Sparkle,
  CookingPot,
  Bed,
  Door,
  Package,
  PaintBrush,
  DeviceMobile,
  Globe,
  TrendUp,
  Users,
  Lightning,
  MapPin,
} from '@phosphor-icons/react';
import { DesignItem } from '../../../types';
import { InquiryItem } from '../../../types/admin';
import { AdminTab } from '../AdminSidebar';
import { useSiteAnalytics } from '../../../hooks/useAdminStore';
import { adminStore } from '../../../services/adminStore';

interface Props {
  designs: DesignItem[];
  inquiries: InquiryItem[];
  onNavigateTab: (tab: AdminTab) => void;
  onOpenAddModal: () => void;
}

export const AdminOverviewTab: React.FC<Props> = ({
  designs,
  inquiries,
  onNavigateTab,
  onOpenAddModal,
}) => {
  const analytics = useSiteAnalytics();

  const kitchensCount = designs.filter(d => d.category === 'kitchens').length;
  const bedroomsCount = designs.filter(d => d.category === 'bedrooms').length;
  const pvcCount = designs.filter(d => d.category === 'pvc-doors').length;
  const wardrobesCount = designs.filter(d => d.category === 'wardrobes').length;
  const decorCount = designs.filter(
    d => d.category === 'interior-design' || d.category === 'living-rooms' || d.category === 'home-decor'
  ).length;
  const featuredCount = designs.filter(d => d.isFeatured).length;

  const totalViews = designs.reduce((acc, d) => acc + (d.views || 0), 0);
  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  // Sort designs by views descending for most viewed section
  const topViewedDesigns = [...designs]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const recentInquiries = inquiries.slice(0, 4);
  const recentDesigns = designs.slice(0, 4);

  // Real traffic & page views computations
  const totalPageViews = Object.values(analytics.pageViews || {}).reduce((acc, v) => acc + v, 0);
  const homePv = analytics.pageViews?.home || 0;
  const designsPv = analytics.pageViews?.designs || 0;
  const detailPv = analytics.pageViews?.['design-detail'] || 0;
  const servicesPv = analytics.pageViews?.services || 0;
  const contactPv = analytics.pageViews?.contact || 0;
  const requestPv = analytics.pageViews?.['project-request'] || 0;

  const totalDevices = (analytics.devices?.mobile || 0) + (analytics.devices?.desktop || 0) + (analytics.devices?.tablet || 0);
  const mobilePct = totalDevices > 0 ? Math.round(((analytics.devices?.mobile || 0) / totalDevices) * 100) : 0;
  const desktopPct = totalDevices > 0 ? Math.round(((analytics.devices?.desktop || 0) / totalDevices) * 100) : 0;
  const tabletPct = totalDevices > 0 ? Math.round(((analytics.devices?.tablet || 0) / totalDevices) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-brand-gold/20 via-brand-surface to-brand-surface border border-brand-gold/30 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-bold">
              <Sparkle size={14} weight="fill" />
              <span>لوحة الإدارة والتحليلات الحية</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-ivory font-arabic">
              مرحباً بك في مركز إدارة شركة <span className="text-gold-gradient">المجد</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-ivory/70 max-w-xl font-light">
              متابعة دقيقة لحركة الزيارات الحقيقية، وإدارة طلبات العملاء، وتحديث محتوى المعرض فورياً.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-gold to-amber-500 text-brand-dark hover:brightness-110 shadow-lg shadow-brand-gold/20 transition-all"
            >
              <PlusCircle size={18} weight="bold" />
              <span>إضافة تصميم جديد</span>
            </button>
            <button
              onClick={() => onNavigateTab('inquiries')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-black/40 border border-brand-gold/30 text-brand-champagne hover:bg-brand-gold/10 transition-all"
            >
              <ChatTeardropDots size={18} weight="duotone" />
              <span>مراجعة الطلبات ({newInquiriesCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 5 KPI Cards (Real Live Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {/* Total Visits */}
        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-gold/20 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold">
              <Globe size={22} weight="duotone" />
            </div>
            <span className="text-[10px] font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full">
              تتبع حي
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-brand-ivory font-mono">
              {analytics.totalVisits.toLocaleString('ar-LY')}
            </h3>
            <p className="text-xs text-brand-ivory/60">إجمالي زيارات الموقع الفعلية</p>
          </div>
        </div>

        {/* Today's Visits */}
        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-gold/20 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <Users size={22} weight="duotone" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              اليوم
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-brand-ivory font-mono">
              {analytics.todayVisits}
            </h3>
            <p className="text-xs text-brand-ivory/60">زيارات اليوم المسجلة</p>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-gold/20 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400">
              <Users size={22} weight="duotone" />
            </div>
            <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
              أجهزة فريدة
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-brand-ivory font-mono">
              {analytics.uniqueVisitors}
            </h3>
            <p className="text-xs text-brand-ivory/60">عدد الزوار الفريدين</p>
          </div>
        </div>

        {/* Inquiries */}
        <div
          onClick={() => onNavigateTab('inquiries')}
          className="p-5 rounded-2xl bg-brand-surface border border-brand-gold/20 hover:border-brand-gold/50 cursor-pointer transition-all shadow-md group space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <ChatTeardropDots size={22} weight="duotone" />
            </div>
            {newInquiriesCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {newInquiriesCount} جديد
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-brand-gold flex items-center gap-1">
                <span>عرض</span>
                <ArrowUpRight size={13} />
              </span>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-brand-ivory font-mono">
              {inquiries.length}
            </h3>
            <p className="text-xs text-brand-ivory/60">طلبات العملاء الواردة</p>
          </div>
        </div>

        {/* WhatsApp Conversion Clicks */}
        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-gold/20 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center text-green-400">
              <WhatsappLogo size={22} weight="fill" />
            </div>
            <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
              نقرات حقيقية
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-brand-ivory font-mono">
              {analytics.whatsappClicks}
            </h3>
            <p className="text-xs text-brand-ivory/60">نقرات التواصل عبر واتساب</p>
          </div>
        </div>
      </div>

      {/* Real Analytics Breakdown: Page Views & Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Real Page Views Breakdown */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-brand-surface border border-brand-gold/20 shadow-lg space-y-5">
          <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-brand-gold" weight="duotone" />
              <h3 className="text-sm font-bold text-brand-ivory">
                توزيع الزيارات حسب صفحات الموقع الفعلية
              </h3>
            </div>
            <span className="text-[11px] text-brand-ivory/50">
              {totalPageViews} تصفح مسجل
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Home */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-ivory font-medium">الصفحة الرئيسية</span>
                <span className="font-bold text-brand-gold font-mono">
                  {homePv} زيارة {totalPageViews > 0 ? `(${Math.round((homePv / totalPageViews) * 100)}%)` : ''}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-gold to-amber-500 transition-all duration-500"
                  style={{ width: `${totalPageViews > 0 ? Math.round((homePv / totalPageViews) * 100) : 0}%` }}
                />
              </div>
            </div>

            {/* Designs */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-ivory font-medium">معرض التصاميم والمشاريع</span>
                <span className="font-bold text-sky-400 font-mono">
                  {designsPv} زيارة {totalPageViews > 0 ? `(${Math.round((designsPv / totalPageViews) * 100)}%)` : ''}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${totalPageViews > 0 ? Math.round((designsPv / totalPageViews) * 100) : 0}%` }}
                />
              </div>
            </div>

            {/* Design Detail */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-ivory font-medium">صفحات تفاصيل التصميم</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {detailPv} زيارة {totalPageViews > 0 ? `(${Math.round((detailPv / totalPageViews) * 100)}%)` : ''}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                  style={{ width: `${totalPageViews > 0 ? Math.round((detailPv / totalPageViews) * 100) : 0}%` }}
                />
              </div>
            </div>

            {/* Services */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-ivory font-medium">صفحة الخدمات والحلول</span>
                <span className="font-bold text-purple-400 font-mono">
                  {servicesPv} زيارة {totalPageViews > 0 ? `(${Math.round((servicesPv / totalPageViews) * 100)}%)` : ''}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${totalPageViews > 0 ? Math.round((servicesPv / totalPageViews) * 100) : 0}%` }}
                />
              </div>
            </div>

            {/* Contact & Request */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-ivory font-medium">صفحات التواصل وطلب مشروع</span>
                <span className="font-bold text-rose-400 font-mono">
                  {contactPv + requestPv} زيارة {totalPageViews > 0 ? `(${Math.round(((contactPv + requestPv) / totalPageViews) * 100)}%)` : ''}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-600 to-rose-500 transition-all duration-500"
                  style={{ width: `${totalPageViews > 0 ? Math.round(((contactPv + requestPv) / totalPageViews) * 100) : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Real Device Breakdown summary */}
          <div className="pt-3 border-t border-brand-gold/15 grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-black/30 border border-brand-gold/15 flex items-center gap-3">
              <DeviceMobile size={22} className="text-brand-gold shrink-0" weight="duotone" />
              <div>
                <span className="text-[11px] text-brand-ivory/60 block">الهواتف الذكية (Mobile)</span>
                <span className="font-bold text-brand-ivory">
                  {totalDevices > 0 ? `${mobilePct}% (${analytics.devices?.mobile || 0} زيارة)` : 'في انتظار الزيارات'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/30 border border-brand-gold/15 flex items-center gap-3">
              <Globe size={22} className="text-emerald-400 shrink-0" weight="duotone" />
              <div>
                <span className="text-[11px] text-brand-ivory/60 block">أجهزة الكمبيوتر (Desktop)</span>
                <span className="font-bold text-brand-ivory">
                  {totalDevices > 0 ? `${desktopPct}% (${analytics.devices?.desktop || 0} زيارة)` : 'في انتظار الزيارات'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Top Viewed Designs */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-brand-surface border border-brand-gold/20 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
            <h3 className="text-sm font-bold text-brand-ivory flex items-center gap-2">
              <Eye size={18} className="text-brand-gold" weight="duotone" />
              <span>التصاميم الأكثر مشاهدة وطلباً</span>
            </h3>
            <span className="text-[11px] text-brand-ivory/50">بناءً على المشاهدات</span>
          </div>

          <div className="space-y-2.5">
            {topViewedDesigns.map((design, idx) => (
              <div
                key={design.id}
                className="p-2.5 rounded-xl bg-black/30 border border-brand-gold/15 flex items-center justify-between gap-3 hover:border-brand-gold/30 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 text-center text-xs font-bold text-brand-gold font-mono">
                    #{idx + 1}
                  </span>
                  <img
                    src={design.mainImage}
                    alt={design.title}
                    className="w-10 h-10 rounded-lg object-cover border border-brand-gold/20 shrink-0"
                    onError={e => {
                      (e.target as HTMLImageElement).src = './projects/p1.jpg';
                    }}
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-brand-ivory truncate">{design.title}</h4>
                    <span className="text-[10px] text-brand-gold">{design.categoryArabic}</span>
                  </div>
                </div>

                <div className="shrink-0 text-left">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-champagne font-mono">
                    <Eye size={13} className="text-brand-gold" />
                    <span>{(design.views || 0).toLocaleString('ar-LY')}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-brand-ivory flex items-center gap-2">
          <span>توزيع التصاميم حسب الأقسام الحالية</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Kitchens */}
          <div className="p-4 rounded-xl bg-brand-surface/60 border border-brand-gold/15 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
              <CookingPot size={20} weight="duotone" />
            </div>
            <div>
              <p className="text-xs text-brand-ivory/70">مطابخ حديثة</p>
              <p className="text-lg font-bold text-brand-ivory font-mono">{kitchensCount}</p>
            </div>
          </div>

          {/* PVC */}
          <div className="p-4 rounded-xl bg-brand-surface/60 border border-brand-gold/15 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <Door size={20} weight="duotone" />
            </div>
            <div>
              <p className="text-xs text-brand-ivory/70">أبواب ونوافذ PVC</p>
              <p className="text-lg font-bold text-brand-ivory font-mono">{pvcCount}</p>
            </div>
          </div>

          {/* Bedrooms */}
          <div className="p-4 rounded-xl bg-brand-surface/60 border border-brand-gold/15 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
              <Bed size={20} weight="duotone" />
            </div>
            <div>
              <p className="text-xs text-brand-ivory/70">غرف نوم وأجنحة</p>
              <p className="text-lg font-bold text-brand-ivory font-mono">{bedroomsCount}</p>
            </div>
          </div>

          {/* Wardrobes */}
          <div className="p-4 rounded-xl bg-brand-surface/60 border border-brand-gold/15 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
              <Package size={20} weight="duotone" />
            </div>
            <div>
              <p className="text-xs text-brand-ivory/70">خزائن ودواليب</p>
              <p className="text-lg font-bold text-brand-ivory font-mono">{wardrobesCount}</p>
            </div>
          </div>

          {/* Decor */}
          <div className="p-4 rounded-xl bg-brand-surface/60 border border-brand-gold/15 flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="w-9 h-9 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0">
              <PaintBrush size={20} weight="duotone" />
            </div>
            <div>
              <p className="text-xs text-brand-ivory/70">ديكور وتصميم داخلي</p>
              <p className="text-lg font-bold text-brand-ivory font-mono">{decorCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Inquiries & Recent Designs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries Box */}
        <div className="p-6 rounded-2xl bg-brand-surface border border-brand-gold/20 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-brand-ivory flex items-center gap-2">
              <ChatTeardropDots size={18} className="text-brand-gold" weight="duotone" />
              <span>آخر طلبات واستفسارات العملاء</span>
            </h3>
            <button
              onClick={() => onNavigateTab('inquiries')}
              className="text-xs text-brand-gold hover:underline font-semibold"
            >
              عرض الكل ({inquiries.length})
            </button>
          </div>

          {recentInquiries.length === 0 ? (
            <p className="text-xs text-brand-ivory/50 py-6 text-center">لا توجد طلبات واردة حتى الآن</p>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map(inq => {
                const phoneClean = inq.phone.replace(/\D/g, '');
                const waPhone = phoneClean.startsWith('218') ? phoneClean : `218${phoneClean.replace(/^0+/, '')}`;
                const waMsg = encodeURIComponent(
                  `السلام عليكم أستاذ ${inq.name}، معك إدارة شركة المجد للمطابخ والديكور (البيضاء) بخصوص طلبك المسجل (${inq.projectType}). نسعد بخدمتك ومناقشة تفاصيل المشروع والمقاسات!`
                );
                const waLink = `https://wa.me/${waPhone}?text=${waMsg}`;

                return (
                  <div
                    key={inq.id}
                    className="p-3.5 rounded-xl bg-black/30 border border-brand-gold/15 flex items-center justify-between gap-3 hover:border-brand-gold/30 transition-all"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brand-ivory truncate">{inq.name}</span>
                        {inq.status === 'new' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            جديد
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-brand-gold truncate">{inq.projectType}</p>
                      <p className="text-[10px] text-brand-ivory/50">
                        {new Date(inq.createdAt).toLocaleDateString('ar-LY')} • {inq.phone}
                        {inq.location && ` • ${inq.location}`}
                      </p>
                    </div>

                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all"
                      title="مراسلة عبر واتساب"
                    >
                      <WhatsappLogo size={18} weight="fill" />
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Designs Box */}
        <div className="p-6 rounded-2xl bg-brand-surface border border-brand-gold/20 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-brand-ivory flex items-center gap-2">
              <Images size={18} className="text-brand-gold" weight="duotone" />
              <span>أحدث التصاميم المعروضة</span>
            </h3>
            <button
              onClick={() => onNavigateTab('designs')}
              className="text-xs text-brand-gold hover:underline font-semibold"
            >
              عرض الكل ({designs.length})
            </button>
          </div>

          <div className="space-y-3">
            {recentDesigns.map(design => (
              <div
                key={design.id}
                className="p-3 rounded-xl bg-black/30 border border-brand-gold/15 flex items-center gap-3"
              >
                <img
                  src={design.mainImage}
                  alt={design.title}
                  className="w-12 h-12 rounded-lg object-cover border border-brand-gold/20 shrink-0"
                  onError={e => {
                    (e.target as HTMLImageElement).src = './projects/p1.jpg';
                  }}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-brand-ivory truncate">{design.title}</h4>
                  <p className="text-[11px] text-brand-gold truncate">{design.categoryArabic}</p>
                  <p className="text-[10px] text-brand-ivory/50">{design.approximateArea || 'مساحة مخصصة'}</p>
                </div>
                {design.isFeatured && (
                  <span className="shrink-0 text-amber-400" title="تصميم مميز">
                    <Star size={16} weight="fill" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

