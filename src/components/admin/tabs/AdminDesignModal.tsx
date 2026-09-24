import React, { useState, useEffect } from 'react';
import {
  X,
  UploadSimple,
  FloppyDisk,
  Sparkle,
  Image as ImageIcon,
  Check,
} from '@phosphor-icons/react';
import { DesignItem, CategoryType, StyleType, SpaceType, ColorType } from '../../../types';
import { adminStore } from '../../../services/adminStore';
import { compressImageFile } from '../../../utils/imageOptimizer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  designToEdit: DesignItem | null;
  onSaveSuccess: () => void;
}

export const AdminDesignModal: React.FC<Props> = ({
  isOpen,
  onClose,
  designToEdit,
  onSaveSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('kitchens');
  const [style, setStyle] = useState<StyleType>('modern');
  const [space, setSpace] = useState<SpaceType>('medium');
  const [approximateArea, setApproximateArea] = useState('');
  const [description, setDescription] = useState('');
  const [materialsStr, setMaterialsStr] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [mainImage, setMainImage] = useState('');
  const [selectedColors, setSelectedColors] = useState<ColorType[]>(['wood', 'white']);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const categoryOptions: { id: CategoryType; label: string }[] = [
    { id: 'kitchens', label: 'مطابخ حديثة فاخرة' },
    { id: 'bedrooms', label: 'غرف نوم وأجنحة' },
    { id: 'pvc-doors', label: 'أبواب ونوافذ و PVC' },
    { id: 'wardrobes', label: 'خزائن وغرف ملابس' },
    { id: 'interior-design', label: 'ديكورات وتصميم صالات' },
  ];

  const styleOptions: { id: StyleType; label: string }[] = [
    { id: 'modern', label: 'مودرن Modern' },
    { id: 'luxury', label: 'فاخر Luxury' },
    { id: 'classic', label: 'كلاسيك Classic' },
    { id: 'minimal', label: 'مينيمال Minimal' },
    { id: 'contemporary', label: 'معاصر Contemporary' },
  ];

  const spaceOptions: { id: SpaceType; label: string }[] = [
    { id: 'small', label: 'صغيرة (Compact)' },
    { id: 'medium', label: 'متوسطة (Medium)' },
    { id: 'large', label: 'واسعة (Spacious)' },
  ];

  const colorOptions: { id: ColorType; label: string; bg: string }[] = [
    { id: 'wood', label: 'خشبي', bg: 'bg-[#965A3E]' },
    { id: 'white', label: 'أبيض', bg: 'bg-white text-black' },
    { id: 'gray', label: 'رمادي', bg: 'bg-gray-500' },
    { id: 'dark', label: 'داكن / أسود', bg: 'bg-neutral-900' },
    { id: 'beige', label: 'بيج', bg: 'bg-[#D2B48C] text-black' },
    { id: 'green', label: 'زيتي / أخضر', bg: 'bg-emerald-800' },
  ];

  useEffect(() => {
    if (designToEdit) {
      setTitle(designToEdit.title);
      setCategory(designToEdit.category);
      setStyle(designToEdit.style);
      setSpace(designToEdit.space);
      setApproximateArea(designToEdit.approximateArea || '');
      setDescription(designToEdit.description || '');
      setMaterialsStr((designToEdit.materials || []).join('، '));
      setTagsStr((designToEdit.tags || []).join('، '));
      setIsFeatured(designToEdit.isFeatured || false);
      setMainImage(designToEdit.mainImage || '');
      setSelectedColors(designToEdit.colors || ['wood']);
    } else {
      // Reset form
      setTitle('');
      setCategory('kitchens');
      setStyle('modern');
      setSpace('medium');
      setApproximateArea('18 م²');
      setDescription('');
      setMaterialsStr('خزائن PVC مقاومة للرطوبة، مفصلات هيدروليك ناعمة، أسطح كوارتز');
      setTagsStr('مطبخ_مودرن، شركة_المجد، ديكور_ليبي');
      setIsFeatured(false);
      setMainImage('./projects/p1.jpg');
      setSelectedColors(['wood', 'white']);
    }
    setError('');
  }, [designToEdit, isOpen]);

  if (!isOpen) return null;

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const res = await compressImageFile(file, {
        maxWidth: 1280,
        maxHeight: 1000,
        quality: 0.78,
      });
      setMainImage(res.dataUrl);
    } catch (err: any) {
      console.error('Error compressing design image:', err);
      setError('فشل في معالجة وضغط الصورة');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleColor = (colorId: ColorType) => {
    setSelectedColors(prev =>
      prev.includes(colorId) ? prev.filter(c => c !== colorId) : [...prev, colorId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('يرجى كتابة عنوان التصميم');
      return;
    }

    if (!mainImage.trim()) {
      setError('يرجى اختيار صورة للتصميم أو رفعها');
      return;
    }

    const categoryObj = categoryOptions.find(c => c.id === category);
    const styleObj = styleOptions.find(s => s.id === style);
    const spaceObj = spaceOptions.find(s => s.id === space);

    const materialsArray = materialsStr
      .split(/[،,]/)
      .map(s => s.trim())
      .filter(Boolean);

    const tagsArray = tagsStr
      .split(/[،,]/)
      .map(s => s.trim())
      .filter(Boolean);

    const colorsArabicMap: Record<ColorType, string> = {
      wood: 'خشبي',
      white: 'أبيض',
      gray: 'رمادي',
      dark: 'داكن',
      black: 'أسود',
      beige: 'بيج',
      green: 'أخضر',
    };

    const colorsArabic = selectedColors.map(c => colorsArabicMap[c] || c);

    if (designToEdit) {
      // Update
      adminStore.updateDesign(designToEdit.id, {
        title: title.trim(),
        category,
        categoryArabic: categoryObj?.label || 'تصميم حديث',
        style,
        styleArabic: styleObj?.label.split(' ')[0] || 'مودرن',
        space,
        spaceArabic: spaceObj?.label.split(' ')[0] || 'متوسطة',
        approximateArea: approximateArea.trim() || '18 م²',
        description: description.trim(),
        materials: materialsArray.length > 0 ? materialsArray : ['خامات عالية الجودة'],
        tags: tagsArray.length > 0 ? tagsArray : ['شركة_المجد'],
        isFeatured,
        mainImage: mainImage.trim(),
        galleryImages: [mainImage.trim()],
        colors: selectedColors,
        colorsArabic,
      });
    } else {
      // Add
      const slug = `design-${Date.now()}`;
      adminStore.addDesign({
        title: title.trim(),
        titleEn: title.trim(),
        slug,
        category,
        categoryArabic: categoryObj?.label || 'تصميم حديث',
        style,
        styleArabic: styleObj?.label.split(' ')[0] || 'مودرن',
        space,
        spaceArabic: spaceObj?.label.split(' ')[0] || 'متوسطة',
        approximateArea: approximateArea.trim() || '18 م²',
        description: description.trim(),
        materials: materialsArray.length > 0 ? materialsArray : ['خامات عالية الجودة'],
        tags: tagsArray.length > 0 ? tagsArray : ['شركة_المجد'],
        isFeatured,
        mainImage: mainImage.trim(),
        galleryImages: [mainImage.trim()],
        colors: selectedColors,
        colorsArabic,
        aspectRatio: 'wide',
      });
    }

    onSaveSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-brand-surface border border-brand-gold/30 rounded-3xl shadow-2xl overflow-hidden my-8 animate-scaleUp">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-brand-gold/20 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-gold/20 text-brand-gold flex items-center justify-center">
              <Sparkle size={18} weight="fill" />
            </div>
            <h3 className="text-base font-bold text-brand-ivory font-arabic">
              {designToEdit ? 'تعديل التصميم' : 'إضافة تصميم جديد للمعرض'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-ivory/60 hover:text-brand-ivory hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-brand-ivory/90">
              عنوان التصميم <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="مثال: مطبخ مودرن رمادي ورخام طبيعي مع جزيرة وسطية"
              className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs text-brand-ivory placeholder:text-brand-ivory/30 focus:outline-none focus:border-brand-gold transition-all"
              required
            />
          </div>

          {/* Category & Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-brand-ivory/90">القسم الرئيسي</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CategoryType)}
                className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs text-brand-ivory focus:outline-none focus:border-brand-gold transition-all"
              >
                {categoryOptions.map(c => (
                  <option key={c.id} value={c.id} className="bg-neutral-900 text-white">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-brand-ivory/90">النمط (Style)</label>
              <select
                value={style}
                onChange={e => setStyle(e.target.value as StyleType)}
                className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs text-brand-ivory focus:outline-none focus:border-brand-gold transition-all"
              >
                {styleOptions.map(s => (
                  <option key={s.id} value={s.id} className="bg-neutral-900 text-white">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Space & Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-brand-ivory/90">حجم المساحة</label>
              <select
                value={space}
                onChange={e => setSpace(e.target.value as SpaceType)}
                className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs text-brand-ivory focus:outline-none focus:border-brand-gold transition-all"
              >
                {spaceOptions.map(s => (
                  <option key={s.id} value={s.id} className="bg-neutral-900 text-white">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-brand-ivory/90">المساحة التقريبية</label>
              <input
                type="text"
                value={approximateArea}
                onChange={e => setApproximateArea(e.target.value)}
                placeholder="مثال: 20 م² أو 4 × 5 متر"
                className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs text-brand-ivory placeholder:text-brand-ivory/30 focus:outline-none focus:border-brand-gold transition-all"
              />
            </div>
          </div>

          {/* Image Upload & URL */}
          <div className="space-y-2 p-4 rounded-2xl bg-black/30 border border-brand-gold/20">
            <label className="block text-xs font-semibold text-brand-ivory/90 flex items-center justify-between">
              <span>صورة التصميم الرئيسية</span>
              <span className="text-[11px] text-brand-gold">يمكنك رفع صورة من جهازك أو وضع رابط</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Image Preview Box */}
              <div className="w-28 h-28 rounded-xl bg-black/50 border border-brand-gold/30 overflow-hidden flex items-center justify-center shrink-0 relative group">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt="معاينة"
                    className="w-full h-full object-cover"
                    onError={e => {
                      (e.target as HTMLImageElement).src = './projects/p1.jpg';
                    }}
                  />
                ) : (
                  <ImageIcon size={32} className="text-brand-ivory/30" />
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-[10px] text-brand-gold">
                    جاري الرفع...
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="space-y-2.5 flex-1 w-full">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-gold/15 border border-brand-gold/30 text-brand-gold hover:bg-brand-gold/25 transition-all">
                  <UploadSimple size={16} />
                  <span>اختر صورة من جهازك</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="space-y-1">
                  <span className="text-[10px] text-brand-ivory/50 block">أو أدخل مسار / رابط الصورة:</span>
                  <input
                    type="text"
                    value={mainImage}
                    onChange={e => setMainImage(e.target.value)}
                    placeholder="./projects/p1.jpg أو رابط مباشر"
                    dir="ltr"
                    className="w-full px-3 py-1.5 bg-black/50 border border-brand-gold/20 rounded-lg text-xs font-mono text-brand-ivory/90 focus:outline-none focus:border-brand-gold transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Colors Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-brand-ivory/90">
              الألوان الأساسية للتصميم
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(c => {
                const isSelected = selectedColors.includes(c.id);
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => toggleColor(c.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'border-brand-gold bg-brand-gold/20 text-brand-gold font-bold shadow-sm'
                        : 'border-white/10 bg-black/40 text-brand-ivory/60 hover:text-brand-ivory'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${c.bg} border border-white/20`} />
                    <span>{c.label}</span>
                    {isSelected && <Check size={12} weight="bold" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Materials */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-brand-ivory/90">
              المواد والخامات المستخدمة (افصل بينها بفاصلة)
            </label>
            <input
              type="text"
              value={materialsStr}
              onChange={e => setMaterialsStr(e.target.value)}
              placeholder="مثال: خزائن PVC تركي عازل، أسطح كوارتز، مفصلات بلوم نمساوية"
              className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs text-brand-ivory placeholder:text-brand-ivory/30 focus:outline-none focus:border-brand-gold transition-all"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-brand-ivory/90">
              الوسوم والكلمات الدلالية
            </label>
            <input
              type="text"
              value={tagsStr}
              onChange={e => setTagsStr(e.target.value)}
              placeholder="مثال: مطبخ_مودرن، كوارتز، شركة_المجد، البيضاء"
              className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs text-brand-ivory placeholder:text-brand-ivory/30 focus:outline-none focus:border-brand-gold transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-brand-ivory/90">وصف التصميم</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="اكتب وصفاً جذاباً يشرح مزايا وتفاصيل التصميم ومناسبته للمساحة..."
              className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs text-brand-ivory placeholder:text-brand-ivory/30 focus:outline-none focus:border-brand-gold transition-all leading-relaxed resize-none"
            />
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-black/30 border border-brand-gold/15">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={e => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-brand-gold text-brand-gold focus:ring-brand-gold bg-black/50 cursor-pointer"
            />
            <label htmlFor="isFeatured" className="text-xs text-brand-ivory font-medium cursor-pointer">
              ⭐ تمييز هذا التصميم (يظهر في قسم التصاميم المختارة بالصفحة الرئيسية)
            </label>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-brand-gold/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-brand-ivory/70 hover:bg-white/5 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-gold to-amber-500 text-brand-dark hover:brightness-110 shadow-lg shadow-brand-gold/20 transition-all"
            >
              <FloppyDisk size={16} weight="bold" />
              <span>{designToEdit ? 'حفظ التعديلات' : 'إضافة التصميم الآن'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
