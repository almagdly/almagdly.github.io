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
  CheckCircle,
  SpinnerGap,
  Image as ImageIcon,
  Sparkle,
} from '@phosphor-icons/react';
import { BeforeAfterItem } from '../../../types';
import { adminStore } from '../../../services/adminStore';
import { compressImageFile, isDataUrl, uploadImageToGitHub, getDataUrlSizeKb } from '../../../utils/imageOptimizer';

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
  const [beforeSizeKb, setBeforeSizeKb] = useState<number | null>(null);
  const [afterSizeKb, setAfterSizeKb] = useState<number | null>(null);

  // Processing & Loading States
  const [isUploadingBefore, setIsUploadingBefore] = useState(false);
  const [isUploadingAfter, setIsUploadingAfter] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitleArabic('');
    setCategoryArabic('مطابخ حديثة');
    setLocation('البيضاء');
    setDuration('أسبوعين');
    setDescription('');
    setBeforeImage('');
    setAfterImage('');
    setBeforeSizeKb(null);
    setAfterSizeKb(null);
    setError('');
    setSaveSuccessMsg('');
    setModalOpen(true);
  };

  const handleLoadDemoImages = () => {
    setBeforeImage('./projects/p2.jpg');
    setAfterImage('./projects/p1.jpg');
    setBeforeSizeKb(null);
    setAfterSizeKb(null);
    setError('');
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
    setBeforeSizeKb(isDataUrl(item.beforeImage) ? getDataUrlSizeKb(item.beforeImage) : null);
    setAfterSizeKb(isDataUrl(item.afterImage) ? getDataUrlSizeKb(item.afterImage) : null);
    setError('');
    setSaveSuccessMsg('');
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

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'before' | 'after'
  ) => {
    const file = e.target.files?.[0];
    // Reset file input value so re-selecting same file works
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)');
      return;
    }

    if (target === 'before') {
      setIsUploadingBefore(true);
    } else {
      setIsUploadingAfter(true);
    }
    setError('');

    try {
      // Compress and optimize camera/phone photo to lightweight crisp web format (~50KB-90KB)
      const res = await compressImageFile(file, {
        maxWidth: 1280,
        maxHeight: 1000,
        quality: 0.78,
        maxSizeKb: 120,
      });

      if (target === 'before') {
        setBeforeImage(res.dataUrl);
        setBeforeSizeKb(res.sizeKb);
      } else {
        setAfterImage(res.dataUrl);
        setAfterSizeKb(res.sizeKb);
      }
    } catch (err: any) {
      console.error('Image compression failed:', err);
      setError('فشل في معالجة وضغط الصورة: ' + (err.message || ''));
    } finally {
      if (target === 'before') {
        setIsUploadingBefore(false);
      } else {
        setIsUploadingAfter(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleArabic.trim()) {
      setError('يرجى إدخال عنوان النموذج');
      return;
    }
    if (!beforeImage.trim() || !afterImage.trim()) {
      setError('يرجى اختيار وتحديد صورتي قبل وبعد التنفيذ');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      let finalBefore = beforeImage.trim();
      let finalAfter = afterImage.trim();

      // If GitHub Token is present, attempt background asset upload to repo so site-data stays tiny
      const settings = adminStore.getSettings();
      const token = settings.githubToken?.trim();
      const repo = settings.githubRepo?.trim() || 'almagdly/almagdly.github.io';
      const branch = settings.githubBranch?.trim() || 'main';
      const timestamp = Date.now();

      if (token) {
        if (isDataUrl(finalBefore)) {
          const beforeName = `ba-${timestamp}-before.jpg`;
          const uploadedUrl = await uploadImageToGitHub(finalBefore, beforeName, token, repo, branch);
          if (uploadedUrl) {
            finalBefore = uploadedUrl;
          }
        }
        if (isDataUrl(finalAfter)) {
          const afterName = `ba-${timestamp}-after.jpg`;
          const uploadedUrl = await uploadImageToGitHub(finalAfter, afterName, token, repo, branch);
          if (uploadedUrl) {
            finalAfter = uploadedUrl;
          }
        }
      }

      if (editingItem) {
        adminStore.updateBeforeAfter(editingItem.id, {
          titleArabic: titleArabic.trim(),
          categoryArabic,
          location: location.trim(),
          duration: duration.trim(),
          description: description.trim(),
          beforeImage: finalBefore,
          afterImage: finalAfter,
        });
      } else {
        adminStore.addBeforeAfter({
          titleArabic: titleArabic.trim(),
          categoryArabic,
          location: location.trim(),
          duration: duration.trim(),
          description: description.trim(),
          beforeImage: finalBefore,
          afterImage: finalAfter,
        });
      }

      setModalOpen(false);
    } catch (err: any) {
      console.error('Error saving before/after:', err);
      setError('حدث خطأ أثناء حفظ النموذج: ' + (err.message || ''));
    } finally {
      setIsSaving(false);
    }
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
              <div className="flex items-center gap-2">
                <ArrowsHorizontal size={20} className="text-brand-gold" />
                <h3 className="text-base font-bold text-brand-ivory font-arabic">
                  {editingItem ? 'تعديل نموذج قبل وبعد' : 'إضافة نموذج جديد لقسم قبل وبعد'}
                </h3>
              </div>
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
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
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

              {/* Fast Demo Images Button (if empty) */}
              {!beforeImage && !afterImage && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-brand-gold/5 border border-brand-gold/20">
                  <span className="text-xs text-brand-ivory/80 flex items-center gap-1.5">
                    <Sparkle size={15} className="text-brand-gold" />
                    <span>يمكنك رفع صورك الخاصة، أو استخدام صور تجريبية للتجربة السريعة:</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleLoadDemoImages}
                    className="px-3 py-1 rounded-lg bg-brand-gold/20 border border-brand-gold/40 text-[11px] font-bold text-brand-gold hover:bg-brand-gold/30 transition-all"
                  >
                    صور تجريبية
                  </button>
                </div>
              )}

              {/* Two Images: Before & After */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Before Image Box */}
                <div className="p-4 rounded-2xl bg-black/30 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span>صورة قبل التنفيذ</span>
                      <span className="text-rose-400">*</span>
                    </span>

                    <label className="cursor-pointer text-[11px] text-brand-gold hover:underline flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      <UploadSimple size={13} />
                      <span>{beforeImage ? 'تغيير الصورة' : 'رفع صورة'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(e, 'before')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Preview Container */}
                  <div className="h-36 rounded-xl bg-black/60 border border-amber-500/20 overflow-hidden relative flex items-center justify-center">
                    {isUploadingBefore ? (
                      <div className="flex flex-col items-center gap-2 text-amber-300 text-xs">
                        <SpinnerGap size={24} className="animate-spin text-brand-gold" />
                        <span>جاري ضغط ومعالجة الصورة...</span>
                      </div>
                    ) : beforeImage ? (
                      <div className="relative w-full h-full group">
                        <img
                          src={beforeImage}
                          alt="معاينة قبل"
                          className="w-full h-full object-cover"
                          onError={e => {
                            (e.target as HTMLImageElement).src = './projects/p2.jpg';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setBeforeImage('');
                            setBeforeSizeKb(null);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-rose-400 hover:bg-rose-500/20 transition-all"
                          title="إزالة الصورة"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center gap-2 text-brand-ivory/40 hover:text-brand-ivory/80 transition-colors p-4 text-center">
                        <ImageIcon size={32} />
                        <span className="text-xs">اضغط هنا لرفع صورة "قبل" من جهازك</span>
                        <span className="text-[10px] text-brand-ivory/30">JPG, PNG, WebP (يتم الضغط تلقائياً)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleImageUpload(e, 'before')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Status / Size / Path */}
                  <div className="space-y-1">
                    {beforeSizeKb !== null ? (
                      <div className="flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        <span className="flex items-center gap-1">
                          <CheckCircle size={13} weight="fill" />
                          <span>صورة مضغوطة وجاهزة</span>
                        </span>
                        <span className="font-mono">{beforeSizeKb} KB</span>
                      </div>
                    ) : beforeImage && !isDataUrl(beforeImage) ? (
                      <input
                        type="text"
                        value={beforeImage}
                        onChange={e => setBeforeImage(e.target.value)}
                        placeholder="./projects/p2.jpg أو رابط"
                        dir="ltr"
                        className="w-full px-2.5 py-1 bg-black/50 border border-amber-500/20 rounded-lg text-[11px] font-mono text-brand-ivory/80"
                      />
                    ) : null}
                  </div>
                </div>

                {/* After Image Box */}
                <div className="p-4 rounded-2xl bg-black/30 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <span>صورة بعد التنفيذ</span>
                      <span className="text-rose-400">*</span>
                    </span>

                    <label className="cursor-pointer text-[11px] text-brand-gold hover:underline flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      <UploadSimple size={13} />
                      <span>{afterImage ? 'تغيير الصورة' : 'رفع صورة'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(e, 'after')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Preview Container */}
                  <div className="h-36 rounded-xl bg-black/60 border border-emerald-500/20 overflow-hidden relative flex items-center justify-center">
                    {isUploadingAfter ? (
                      <div className="flex flex-col items-center gap-2 text-emerald-300 text-xs">
                        <SpinnerGap size={24} className="animate-spin text-brand-gold" />
                        <span>جاري ضغط ومعالجة الصورة...</span>
                      </div>
                    ) : afterImage ? (
                      <div className="relative w-full h-full group">
                        <img
                          src={afterImage}
                          alt="معاينة بعد"
                          className="w-full h-full object-cover"
                          onError={e => {
                            (e.target as HTMLImageElement).src = './projects/p1.jpg';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setAfterImage('');
                            setAfterSizeKb(null);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-rose-400 hover:bg-rose-500/20 transition-all"
                          title="إزالة الصورة"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center gap-2 text-brand-ivory/40 hover:text-brand-ivory/80 transition-colors p-4 text-center">
                        <ImageIcon size={32} />
                        <span className="text-xs">اضغط هنا لرفع صورة "بعد" من جهازك</span>
                        <span className="text-[10px] text-brand-ivory/30">JPG, PNG, WebP (يتم الضغط تلقائياً)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleImageUpload(e, 'after')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Status / Size / Path */}
                  <div className="space-y-1">
                    {afterSizeKb !== null ? (
                      <div className="flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        <span className="flex items-center gap-1">
                          <CheckCircle size={13} weight="fill" />
                          <span>صورة مضغوطة وجاهزة</span>
                        </span>
                        <span className="font-mono">{afterSizeKb} KB</span>
                      </div>
                    ) : afterImage && !isDataUrl(afterImage) ? (
                      <input
                        type="text"
                        value={afterImage}
                        onChange={e => setAfterImage(e.target.value)}
                        placeholder="./projects/p1.jpg أو رابط"
                        dir="ltr"
                        className="w-full px-2.5 py-1 bg-black/50 border border-emerald-500/20 rounded-lg text-[11px] font-mono text-brand-ivory/80"
                      />
                    ) : null}
                  </div>
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
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-brand-ivory/70 hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploadingBefore || isUploadingAfter}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-gold to-amber-500 text-brand-dark hover:brightness-110 shadow-lg shadow-brand-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <SpinnerGap size={16} className="animate-spin" />
                      <span>جاري الحفظ والمزامنة...</span>
                    </>
                  ) : (
                    <>
                      <FloppyDisk size={16} weight="bold" />
                      <span>حفظ النموذج</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
