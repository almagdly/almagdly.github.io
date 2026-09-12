import React, { useState } from 'react';
import {
  ArrowsHorizontal,
  PlusCircle,
  PencilSimple,
  Trash,
  UploadSimple,
  FloppyDisk,
  X,
  MapPin,
  Clock,
  ArrowCounterClockwise,
  Eye,
  CheckCircle,
} from '@phosphor-icons/react';
import { BeforeAfterItem, CategoryType } from '../../../types';
import { adminStore } from '../../../services/adminStore';

interface Props {
  beforeAfterList: BeforeAfterItem[];
}

export const AdminBeforeAfterTab: React.FC<Props> = ({ beforeAfterList }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BeforeAfterItem | null>(null);

  // Form State
  const [titleArabic, setTitleArabic] = useState('');
  const [categoryArabic, setCategoryArabic] = useState('مطابخ حديثة');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [error, setError] = useState('');
  const [previewSliderPos, setPreviewSliderPos] = useState(50);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitleArabic('');
    setCategoryArabic('مطابخ حديثة');
    setLocation('البيضاء');
    setDuration('أسبوعين');
    setDescription('');
    setBeforeImage('./projects/p2.jpg');
    setAfterImage('./projects/p1.jpg');
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item: BeforeAfterItem) => {
    setEditingItem(item);
    setTitleArabic(item.titleArabic);
    setCategoryArabic(item.categoryArabic || 'مطابخ حديثة');
    setLocation(item.location || 'البيضاء');
    setDuration(item.duration || 'أسبوعين');
    setDescription(item.description || '');
    setBeforeImage(item.beforeImage);
    setAfterImage(item.afterImage);
    setError('');
    setModalOpen(true);
  };

  const handleDelete = (item: BeforeAfterItem) => {
    if (window.confirm(`هل أنت متأكد من حذف نموذج قبل وبعد: "${item.titleArabic}"؟`)) {
      adminStore.deleteBeforeAfter(item.id);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('هل تريد استعادة نماذج قبل وبعد الافتراضية؟')) {
      adminStore.resetBeforeAfterToDefault();
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'before' | 'after'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      if (target === 'before') {
        setBeforeImage(dataUrl);
      } else {
        setAfterImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleArabic.trim()) {
      setError('يرجى إدخال عنوان النموذج');
      return;
    }
    if (!beforeImage.trim() || !afterImage.trim()) {
      setError('يرجى تحديد صورتي قبل وبعد');
      return;
    }

    if (editingItem) {
      adminStore.updateBeforeAfter(editingItem.id, {
        titleArabic: titleArabic.trim(),
        categoryArabic,
        location: location.trim(),
        duration: duration.trim(),
        description: description.trim(),
        beforeImage: beforeImage.trim(),
        afterImage: afterImage.trim(),
      });
    } else {
      adminStore.addBeforeAfter({
        titleArabic: titleArabic.trim(),
        categoryArabic,
        location: location.trim(),
        duration: duration.trim(),
        description: description.trim(),
        beforeImage: beforeImage.trim(),
        afterImage: afterImage.trim(),
      });
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-ivory font-arabic">
            إدارة صور ومشاريع (قبل و بعد)
          </h2>
          <p className="text-xs text-brand-ivory/60">
            تعديل وإضافة الصور التفاعلية التي تظهر في قسم "قبل وبعد التنفيذ" بالصفحة الرئيسية
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-black/40 border border-brand-gold/20 text-brand-ivory/70 hover:text-brand-ivory transition-colors flex items-center gap-1.5"
            title="استعادة النماذج الافتراضية"
          >
            <ArrowCounterClockwise size={15} />
            <span className="hidden sm:inline">الافتراضي</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-gold to-amber-500 text-brand-dark hover:brightness-110 shadow-lg shadow-brand-gold/20 transition-all"
          >
            <PlusCircle size={18} weight="bold" />
            <span>إضافة نموذج جديد</span>
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {beforeAfterList.map((item, idx) => (
          <div
            key={item.id}
            className="rounded-2xl bg-brand-surface border border-brand-gold/20 overflow-hidden shadow-lg flex flex-col justify-between hover:border-brand-gold/40 transition-all"
          >
            {/* Split Images Thumbnail */}
            <div className="relative h-52 bg-black/60 overflow-hidden group">
              <div className="grid grid-cols-2 h-full">
                {/* Before Side */}
                <div className="relative h-full border-l border-brand-gold/30 overflow-hidden">
                  <img
                    src={item.beforeImage}
                    alt="قبل"
                    className="w-full h-full object-cover"
                    onError={e => {
                      (e.target as HTMLImageElement).src = './projects/p2.jpg';
                    }}
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-amber-300 border border-amber-400/30">
                    قبل التنفيذ
                  </span>
                </div>

                {/* After Side */}
                <div className="relative h-full overflow-hidden">
                  <img
                    src={item.afterImage}
                    alt="بعد"
                    className="w-full h-full object-cover"
                    onError={e => {
                      (e.target as HTMLImageElement).src = './projects/p1.jpg';
                    }}
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-emerald-300 border border-emerald-400/30">
                    بعد التنفيذ
                  </span>
                </div>
              </div>

              {/* Number Badge */}
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-brand-gold text-brand-dark text-[10px] font-bold shadow-sm">
                نموذج #{idx + 1}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-brand-ivory">{item.titleArabic}</h3>
                <p className="text-xs text-brand-ivory/60 line-clamp-2">{item.description}</p>
              </div>

              <div className="pt-2 border-t border-brand-gold/15 flex items-center justify-between text-xs text-brand-ivory/60">
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  {item.location && (
                    <span className="flex items-center gap-1 font-arabic">
                      <MapPin size={13} className="text-brand-gold" />
                      <span>{item.location}</span>
                    </span>
                  )}
                  {item.duration && (
                    <span className="flex items-center gap-1 font-arabic">
                      <Clock size={13} className="text-brand-gold" />
                      <span>{item.duration}</span>
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg bg-black/40 text-sky-400 hover:bg-sky-500/20 border border-sky-500/30 transition-colors"
                    title="تعديل"
                  >
                    <PencilSimple size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1.5 rounded-lg bg-black/40 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
                    title="حذف"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-brand-surface border border-brand-gold/30 rounded-3xl shadow-2xl overflow-hidden my-8 animate-scaleUp">
            {/* Header */}
            <div className="px-6 py-4 border-b border-brand-gold/20 flex items-center justify-between bg-black/30">
              <h3 className="text-base font-bold text-brand-ivory font-arabic">
                {editingItem ? 'تعديل نموذج قبل وبعد' : 'إضافة نموذج جديد لقسم قبل وبعد'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-brand-ivory/60 hover:text-brand-ivory hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brand-ivory/90">
                  عنوان المشروع <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={titleArabic}
                  onChange={e => setTitleArabic(e.target.value)}
                  placeholder="مثال: تجديد وتطوير مطبخ مودرن بإضاءات مخفية"
                  className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs text-brand-ivory focus:outline-none focus:border-brand-gold"
                  required
                />
              </div>

              {/* Two Images: Before & After */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Before Image */}
                <div className="p-4 rounded-2xl bg-black/30 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">صورة قبل التنفيذ</span>
                    <label className="cursor-pointer text-[11px] text-brand-gold hover:underline flex items-center gap-1">
                      <UploadSimple size={14} />
                      <span>رفع صورة</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(e, 'before')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="h-32 rounded-xl bg-black/50 border border-amber-500/20 overflow-hidden">
                    <img
                      src={beforeImage}
                      alt="معاينة قبل"
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLImageElement).src = './projects/p2.jpg';
                      }}
                    />
                  </div>

                  <input
                    type="text"
                    value={beforeImage}
                    onChange={e => setBeforeImage(e.target.value)}
                    placeholder="./projects/p2.jpg أو رابط"
                    dir="ltr"
                    className="w-full px-3 py-1.5 bg-black/50 border border-amber-500/20 rounded-lg text-xs font-mono text-brand-ivory"
                  />
                </div>

                {/* After Image */}
                <div className="p-4 rounded-2xl bg-black/30 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300">صورة بعد التنفيذ</span>
                    <label className="cursor-pointer text-[11px] text-brand-gold hover:underline flex items-center gap-1">
                      <UploadSimple size={14} />
                      <span>رفع صورة</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(e, 'after')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="h-32 rounded-xl bg-black/50 border border-emerald-500/20 overflow-hidden">
                    <img
                      src={afterImage}
                      alt="معاينة بعد"
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLImageElement).src = './projects/p1.jpg';
                      }}
                    />
                  </div>

                  <input
                    type="text"
                    value={afterImage}
                    onChange={e => setAfterImage(e.target.value)}
                    placeholder="./projects/p1.jpg أو رابط"
                    dir="ltr"
                    className="w-full px-3 py-1.5 bg-black/50 border border-emerald-500/20 rounded-lg text-xs font-mono text-brand-ivory"
                  />
                </div>
              </div>

              {/* Location & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-brand-ivory/90">الموقع / المدينة</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="مثال: البيضاء - حي الأندلس"
                    className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs text-brand-ivory focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-brand-ivory/90">مدة التنفيذ</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    placeholder="مثال: أسبوعين أو 18 يوماً"
                    className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs text-brand-ivory focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brand-ivory/90">وصف العمل المنفّذ</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="اشرح ما تم تنفيذه وتطويره في هذا المشروع..."
                  className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs text-brand-ivory focus:outline-none focus:border-brand-gold resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-brand-gold/20 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-brand-ivory/70 hover:bg-white/5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-gold to-amber-500 text-brand-dark hover:brightness-110 shadow-lg shadow-brand-gold/20 transition-all"
                >
                  <FloppyDisk size={16} weight="bold" />
                  <span>حفظ النموذج</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
