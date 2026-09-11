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
} from '@phosphor-icons/react';
import { DesignItem } from '../../../types';
import { InquiryItem } from '../../../types/admin';
import { AdminTab } from '../AdminSidebar';

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
  const kitchensCount = designs.filter(d => d.category === 'kitchens').length;
  const bedroomsCount = designs.filter(d => d.category === 'bedrooms').length;
  const pvcCount = designs.filter(d => d.category === 'pvc-doors').length;
  const wardrobesCount = designs.filter(d => d.category === 'wardrobes').length;
  const decorCount = designs.filter(d => d.category === 'interior-design' || d.category === 'living-rooms' || d.category === 'home-decor').length;
  const featuredCount = designs.filter(d => d.isFeatured).length;

  const totalViews = designs.reduce((acc, d) => acc + (d.views || 0), 0);
  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  const recentInquiries = inquiries.slice(0, 4);
  const recentDesigns = designs.slice(0, 4);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-brand-gold/20 via-brand-surface to-brand-surface border border-brand-gold/30 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-bold">
              <Sparkle size={14} weight="fill" />
              <span>لوحة الإدارة والمتابعة الحية</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-ivory font-arabic">
              مرحباً بك في مركز إدارة شركة <span className="text-gold-gradient">المجد</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-ivory/70 max-w-xl font-light">
              يمكنك من هنا إضافة وتعديل وحذف التصاميم، ومتابعة رسائل وطلبات العملاء الواردة من الموقع، ومراسلتهم مباشرة عبر واتساب.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
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

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Designs */}
        <div
          onClick={() => onNavigateTab('designs')}
          className="p-5 rounded-2xl bg-brand-surface border border-brand-gold/20 hover:border-brand-gold/50 cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
              <Images size={22} weight="duotone" />
            </div>
            <span className="text-[11px] font-semibold text-brand-gold flex items-center gap-1">
              <span>إدارة</span>
              <ArrowUpRight size={13} />
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-brand-ivory font-mono">
              {designs.length}
            </h3>
            <p className="text-xs text-brand-ivory/60">إجمالي تصاميم المعرض</p>
          </div>
        </div>

        {/* Customer Inquiries */}
        <div
          onClick={() => onNavigateTab('inquiries')}
          className="p-5 rounded-2xl bg-brand-surface border border-brand-gold/20 hover:border-brand-gold/50 cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <ChatTeardropDots size={22} weight="duotone" />
            </div>
            {newInquiriesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                {newInquiriesCount} جديد
              </span>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-brand-ivory font-mono">
              {inquiries.length}
            </h3>
            <p className="text-xs text-brand-ivory/60">طلبات واستفسارات واردة</p>
          </div>
        </div>

        {/* Featured Designs */}
        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-gold/20 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
              <Star size={22} weight="duotone" />
            </div>
            <span className="text-[11px] text-amber-400/80 font-medium">الصفحة الرئيسية</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-brand-ivory font-mono">
              {featuredCount}
            </h3>
            <p className="text-xs text-brand-ivory/60">تصاميم مختارة ومميزة</p>
          </div>
        </div>

        {/* Total Views */}
        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-gold/20 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-400">
              <Eye size={22} weight="duotone" />
            </div>
            <span className="text-[11px] text-sky-400/80 font-medium">تفاعل المعرض</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-brand-ivory font-mono">
              {totalViews.toLocaleString('ar-LY')}
            </h3>
            <p className="text-xs text-brand-ivory/60">إجمالي مشاهدات الأعمال</p>
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
              className="text-xs text-brand-gold hover:underline"
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
                const waMsg = encodeURIComponent(`مرحباً أستاذ ${inq.name}، معك إدارة شركة المجد للمطابخ والديكور بخصوص طلبك (${inq.projectType}). يسعدنا تواصلكم!`);
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
              className="text-xs text-brand-gold hover:underline"
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
