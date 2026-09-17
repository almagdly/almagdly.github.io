import React, { useState, useMemo } from 'react';
import {
  ChatTeardropDots,
  WhatsappLogo,
  Phone,
  Trash,
  MagnifyingGlass,
  PlusCircle,
  Lightning,
  Copy,
  Check,
  CheckCircle,
  MapPin,
  X,
  FloppyDisk,
  Sparkle,
} from '@phosphor-icons/react';
import { InquiryItem } from '../../../types/admin';
import { adminStore } from '../../../services/adminStore';

interface Props {
  inquiries: InquiryItem[];
}

export const AdminInquiriesTab: React.FC<Props> = ({ inquiries }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Manual Add Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newType, setNewType] = useState('مطبخ عصري (PVC / MDF)');
  const [newLocation, setNewLocation] = useState('البيضاء');
  const [newDetails, setNewDetails] = useState('');

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

  const handleSimulate = () => {
    adminStore.simulateCustomerInquiry();
  };

  const handleCopy = (item: InquiryItem) => {
    const text = `طلب عميل شركة المجد:
الاسم: ${item.name}
الهاتف: ${item.phone}
النوع: ${item.projectType}
الموقع: ${item.location || 'غير محدد'}
التفاصيل: ${item.details || 'لا يوجد'}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    adminStore.addInquiry({
      name: newName.trim(),
      phone: newPhone.trim(),
      type: 'project_request',
      projectType: newType,
      location: newLocation.trim(),
      details: newDetails.trim(),
    });

    setNewName('');
    setNewPhone('');
    setNewDetails('');
    setIsAddModalOpen(false);
  };

  const formatWhatsAppLink = (item: InquiryItem) => {
    const clean = item.phone.replace(/\D/g, '');
    const full = clean.startsWith('218') ? clean : `218${clean.replace(/^0+/, '')}`;
    const text = `السلام عليكم ورحمة الله أستاذ ${item.name}، معك إدارة شركة المجد للمطابخ الحديثة والديكور (البيضاء) بخصوص طلبك المسجل (${item.projectType}). نسعد بخدمتك ومناقشة تفاصيل المشروع والمقاسات!`;
    return `https://wa.me/${full}?text=${encodeURIComponent(text)}`;
  };

  const newCount = inquiries.filter(i => i.status === 'new').length;
  const inProgressCount = inquiries.filter(i => i.status === 'in_progress').length;
  const completedCount = inquiries.filter(i => i.status === 'completed').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-ivory font-arabic">
            طلبات واستفسارات العملاء الواردة
          </h2>
          <p className="text-xs text-brand-ivory/60">
            تتبع ومراسلة جميع العملاء الذين سجلوا طلباتهم من الموقع أو المعرض
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Simulate Button */}
          <button
            onClick={handleSimulate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-all"
            title="توليد طلب تجريبي واقعي للاختبار"
          >
            <Lightning size={16} weight="fill" className="text-emerald-400" />
            <span>محاكاة طلب تجريبي</span>
          </button>

          {/* Add Manual Request */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-gold to-amber-500 text-brand-dark hover:brightness-110 shadow-md shadow-brand-gold/20 transition-all"
          >
            <PlusCircle size={16} weight="bold" />
            <span>تسجيل طلب يدوي</span>
          </button>
        </div>
      </div>

      {/* Quick Status Badges Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
            statusFilter === 'all'
              ? 'bg-brand-gold text-brand-dark font-bold shadow-sm'
              : 'bg-black/40 text-brand-ivory/70 border border-brand-gold/20 hover:text-brand-ivory'
          }`}
        >
          الكل ({inquiries.length})
        </button>

        <button
          onClick={() => setStatusFilter('new')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
            statusFilter === 'new'
              ? 'bg-rose-500 text-white font-bold shadow-sm'
              : 'bg-black/40 text-rose-300 border border-rose-500/30 hover:bg-rose-500/10'
          }`}
        >
          <span>جديد</span>
          <span className="px-1.5 py-0.2 rounded-full bg-rose-700/50 text-[10px] font-mono">
            {newCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('in_progress')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
            statusFilter === 'in_progress'
              ? 'bg-amber-500 text-brand-dark font-bold shadow-sm'
              : 'bg-black/40 text-amber-300 border border-amber-500/30 hover:bg-amber-500/10'
          }`}
        >
          <span>قيد التنفيذ</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-700/50 text-[10px] font-mono">
            {inProgressCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
            statusFilter === 'completed'
              ? 'bg-emerald-500 text-brand-dark font-bold shadow-sm'
              : 'bg-black/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/10'
          }`}
        >
          <span>مكتمل</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-700/50 text-[10px] font-mono">
            {completedCount}
          </span>
        </button>
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
            <option value="all" className="bg-neutral-900 text-white">جميع الحالات ({inquiries.length})</option>
            <option value="new" className="bg-neutral-900 text-white">طلبات جديدة ({newCount})</option>
            <option value="contacted" className="bg-neutral-900 text-white">تم التواصل</option>
            <option value="in_progress" className="bg-neutral-900 text-white">قيد التنفيذ ({inProgressCount})</option>
            <option value="completed" className="bg-neutral-900 text-white">مكتمل ({completedCount})</option>
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
                    {/* Copy Client Info */}
                    <button
                      onClick={() => handleCopy(item)}
                      className="p-1.5 rounded-lg bg-black/40 text-brand-ivory/70 hover:text-brand-champagne border border-brand-gold/20 transition-colors"
                      title="نسخ بيانات العميل"
                    >
                      {copiedId === item.id ? (
                        <Check size={16} className="text-emerald-400" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>

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

      {/* Manual Inquiry Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-brand-surface border border-brand-gold/30 rounded-3xl shadow-2xl overflow-hidden my-8 animate-scaleUp">
            <div className="px-6 py-4 border-b border-brand-gold/20 flex items-center justify-between bg-black/30">
              <div className="flex items-center gap-2">
                <Sparkle size={18} className="text-brand-gold" weight="fill" />
                <h3 className="text-base font-bold text-brand-ivory font-arabic">
                  تسجيل طلب عميل جديد (يدوياً أو هاتفياً)
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-brand-ivory/60 hover:text-brand-ivory hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleManualAddSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-bold text-brand-gold">اسم العميل</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="مثال: أ. محمد الورفلي"
                  className="w-full bg-brand-dark/90 border border-brand-gold/20 focus:border-brand-gold rounded-xl px-4 py-2.5 text-xs text-brand-ivory outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-brand-gold">رقم الهاتف (ليبي)</label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  placeholder="091 XXXXXXX"
                  className="w-full bg-brand-dark/90 border border-brand-gold/20 focus:border-brand-gold rounded-xl px-4 py-2.5 text-xs text-brand-ivory outline-none text-right"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-brand-gold">نوع المشروع</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  className="w-full bg-brand-dark/90 border border-brand-gold/20 focus:border-brand-gold rounded-xl px-4 py-2.5 text-xs text-brand-ivory outline-none cursor-pointer"
                >
                  <option value="مطبخ عصري (PVC / MDF)">مطبخ عصري حديث (PVC / MDF)</option>
                  <option value="أبواب ونوافذ PVC فاخرة">أبواب ونوافذ PVC فاخرة</option>
                  <option value="غرفة نوم / جناح رئيسي">غرفة نوم / جناح رئيسي</option>
                  <option value="خزائن ودولاب ملابس (Closet)">خزائن ودولاب ملابس (Closet)</option>
                  <option value="ديكور صالة أو شاشة تلفزيون">ديكور صالة أو شاشة تلفزيون</option>
                  <option value="تصميم فيلا متكامل">تصميم فيلا متكامل</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-brand-gold">المدينة أو الحي</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  placeholder="مثال: البيضاء - حي الأندلس"
                  className="w-full bg-brand-dark/90 border border-brand-gold/20 focus:border-brand-gold rounded-xl px-4 py-2.5 text-xs text-brand-ivory outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-brand-gold">ملاحظات وتفاصيل الاستفسار</label>
                <textarea
                  rows={3}
                  value={newDetails}
                  onChange={e => setNewDetails(e.target.value)}
                  placeholder="سجل ما طلبه العميل عبر الهاتف أو في المعرض..."
                  className="w-full bg-brand-dark/90 border border-brand-gold/20 focus:border-brand-gold rounded-xl p-3 text-xs text-brand-ivory outline-none resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-brand-ivory/60 hover:bg-white/5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-brand-gold to-amber-500 text-brand-dark hover:brightness-110 shadow-md transition-all"
                >
                  <FloppyDisk size={16} weight="bold" />
                  <span>حفظ الطلب باللوحة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

