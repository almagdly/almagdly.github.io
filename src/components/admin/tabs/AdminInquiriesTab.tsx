import React, { useState, useMemo } from 'react';
import {
  ChatTeardropDots,
  WhatsappLogo,
  Phone,
  Trash,
  MagnifyingGlass,
  Funnel,
  CheckCircle,
  Clock,
  MapPin,
  Buildings,
} from '@phosphor-icons/react';
import { InquiryItem } from '../../../types/admin';
import { adminStore } from '../../../services/adminStore';

interface Props {
  inquiries: InquiryItem[];
}

export const AdminInquiriesTab: React.FC<Props> = ({ inquiries }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const statusMap: Record<InquiryItem['status'], { label: string; bg: string; text: string }> = {
    new: { label: 'جديد', bg: 'bg-rose-500/15', text: 'text-rose-400 border-rose-500/30' },
    contacted: { label: 'تم التواصل', bg: 'bg-sky-500/15', text: 'text-sky-400 border-sky-500/30' },
    in_progress: { label: 'قيد التنفيذ', bg: 'bg-amber-500/15', text: 'text-amber-400 border-amber-500/30' },
    completed: { label: 'مكتمل', bg: 'bg-emerald-500/15', text: 'text-emerald-400 border-emerald-500/30' },
    cancelled: { label: 'ملغي', bg: 'bg-gray-500/15', text: 'text-gray-400 border-gray-500/30' },
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(item => {
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchPhone = item.phone.includes(q);
        const matchType = (item.projectType || '').toLowerCase().includes(q);
        const matchLocation = (item.location || '').toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchType && !matchLocation) {
          return false;
        }
      }
      return true;
    });
  }, [inquiries, statusFilter, searchQuery]);

  const handleStatusChange = (id: string, newStatus: InquiryItem['status']) => {
    adminStore.updateInquiryStatus(id, newStatus);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`هل أنت متأكد من حذف طلب العميل: "${name}"؟`)) {
      adminStore.deleteInquiry(id);
    }
  };

  const formatWhatsAppLink = (item: InquiryItem) => {
    const clean = item.phone.replace(/\D/g, '');
    const full = clean.startsWith('218') ? clean : `218${clean.replace(/^0+/, '')}`;
    const text = `السلام عليكم ورحمة الله أستاذ ${item.name}، معك إدارة شركة المجد للمطابخ الحديثة والديكور (البيضاء) بخصوص طلبك المسجل (${item.projectType}). نسعد بخدمتك ومناقشة تفاصيل المشروع والمقاسات!`;
    return `https://wa.me/${full}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-ivory font-arabic">
            طلبات واستفسارات العملاء الواردة
          </h2>
          <p className="text-xs text-brand-ivory/60">
            تتبع ومراسلة جميع العملاء الذين سجلوا طلباتهم من الموقع
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-black/40 border border-brand-gold/20 text-xs text-brand-champagne font-bold">
            الإجمالي: {inquiries.length} طلب
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-brand-surface border border-brand-gold/20 grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="sm:col-span-8 relative">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-brand-ivory/40">
            <MagnifyingGlass size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم العميل، رقم الهاتف، أو نوع المشروع..."
            className="w-full pl-4 pr-10 py-2.5 bg-black/40 border border-brand-gold/25 rounded-xl text-xs text-brand-ivory placeholder:text-brand-ivory/30 focus:outline-none focus:border-brand-gold transition-all"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-black/40 border border-brand-gold/25 rounded-xl text-xs text-brand-ivory focus:outline-none focus:border-brand-gold transition-all"
          >
            <option value="all" className="bg-neutral-900 text-white">جميع الحالات</option>
            <option value="new" className="bg-neutral-900 text-white">طلبات جديدة</option>
            <option value="contacted" className="bg-neutral-900 text-white">تم التواصل</option>
            <option value="in_progress" className="bg-neutral-900 text-white">قيد التنفيذ</option>
            <option value="completed" className="bg-neutral-900 text-white">مكتمل</option>
            <option value="cancelled" className="bg-neutral-900 text-white">ملغي</option>
          </select>
        </div>
      </div>

      {/* Inquiries Cards Grid */}
      {filteredInquiries.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-brand-surface border border-brand-gold/20 text-brand-ivory/50 space-y-2">
          <ChatTeardropDots size={40} className="mx-auto text-brand-gold/30" />
          <p className="text-sm">لا توجد طلبات مطابقة للمعايير المحددة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInquiries.map(item => {
            const statusConfig = statusMap[item.status] || statusMap.new;
            const waLink = formatWhatsAppLink(item);

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-brand-surface border border-brand-gold/20 hover:border-brand-gold/40 transition-all space-y-4 shadow-md relative"
              >
                {/* Card Header: Client Name & Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-brand-ivory">{item.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-brand-ivory/60 font-mono">
                      <a
                        href={`tel:${item.phone}`}
                        className="hover:text-brand-gold flex items-center gap-1 transition-colors"
                        dir="ltr"
                      >
                        <Phone size={13} />
                        <span>{item.phone}</span>
                      </a>
                      {item.location && (
                        <span className="flex items-center gap-1 font-arabic">
                          <MapPin size={13} className="text-brand-gold" />
                          <span>{item.location}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={item.status}
                    onChange={e =>
                      handleStatusChange(item.id, e.target.value as InquiryItem['status'])
                    }
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${statusConfig.bg} ${statusConfig.text}`}
                  >
                    <option value="new" className="bg-neutral-900 text-white">جديد</option>
                    <option value="contacted" className="bg-neutral-900 text-white">تم التواصل</option>
                    <option value="in_progress" className="bg-neutral-900 text-white">قيد التنفيذ</option>
                    <option value="completed" className="bg-neutral-900 text-white">مكتمل</option>
                    <option value="cancelled" className="bg-neutral-900 text-white">ملغي</option>
                  </select>
                </div>

                {/* Project Details Box */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-brand-gold/15 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-brand-gold font-bold">
                    <span>{item.projectType}</span>
                    {item.spaceSize && (
                      <span className="text-brand-ivory/70 font-mono text-[11px]">
                        المساحة: {item.spaceSize}
                      </span>
                    )}
                  </div>

                  {item.preferredStyle && (
                    <div className="text-[11px] text-brand-ivory/60">
                      النمط المفضل: <span className="text-brand-champagne">{item.preferredStyle}</span>
                    </div>
                  )}

                  {item.details && (
                    <p className="text-xs text-brand-ivory/80 leading-relaxed pt-1 border-t border-brand-gold/10">
                      "{item.details}"
                    </p>
                  )}
                </div>

                {/* Card Footer: Date & Direct Actions */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[11px] text-brand-ivory/40">
                    {new Date(item.createdAt).toLocaleDateString('ar-LY', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* WhatsApp Direct */}
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs font-bold transition-colors"
                    >
                      <WhatsappLogo size={16} weight="fill" />
                      <span>واتساب</span>
                    </a>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="حذف الطلب"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
