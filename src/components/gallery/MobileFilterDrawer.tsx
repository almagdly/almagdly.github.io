import React from 'react';
import { CategoryType, StyleType, ColorType, SpaceType, SortType } from '../../types';
import { X, Check, ArrowClockwise, SlidersHorizontal } from '@phosphor-icons/react';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  selectedStyle: StyleType | 'all';
  onSelectStyle: (style: StyleType | 'all') => void;
  selectedColor: ColorType | 'all';
  onSelectColor: (color: ColorType | 'all') => void;
  selectedSpace: SpaceType | 'all';
  onSelectSpace: (space: SpaceType | 'all') => void;
  sortBy: SortType;
  onSelectSort: (sort: SortType) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  selectedStyle,
  onSelectStyle,
  selectedColor,
  onSelectColor,
  selectedSpace,
  onSelectSpace,
  sortBy,
  onSelectSort,
  onResetFilters,
  totalResultsCount,
}) => {
  const categories: { id: CategoryType; label: string }[] = [
    { id: 'kitchens', label: 'مطابخ حديثة (66)' },
    { id: 'bedrooms', label: 'غرف نوم فاخرة (27)' },
    { id: 'wardrobes', label: 'خزائن وغرف غسيل (20)' },
    { id: 'interior-design', label: 'ديكورات وتصميم صالات (20)' },
    { id: 'pvc-doors', label: 'أبواب ونوافذ و PVC (39)' },
  ];

  const styles: { id: StyleType | 'all'; label: string }[] = [
    { id: 'all', label: 'الكل' },
    { id: 'modern', label: 'مودرن' },
    { id: 'luxury', label: 'فاخر' },
    { id: 'minimal', label: 'مينيمال' },
    { id: 'contemporary', label: 'معاصر' },
    { id: 'classic', label: 'كلاسيك' },
  ];

  const colors: { id: ColorType | 'all'; label: string; bgClass: string }[] = [
    { id: 'all', label: 'الكل', bgClass: 'bg-neutral-600' },
    { id: 'white', label: 'أبيض', bgClass: 'bg-white' },
    { id: 'beige', label: 'بيج', bgClass: 'bg-[#DFCAA7]' },
    { id: 'black', label: 'أسود', bgClass: 'bg-black' },
    { id: 'gray', label: 'رمادي', bgClass: 'bg-gray-400' },
    { id: 'wood', label: 'خشبي', bgClass: 'bg-[#9B7C4F]' },
    { id: 'dark', label: 'داكن', bgClass: 'bg-[#043337]' },
    { id: 'green', label: 'أخضر', bgClass: 'bg-[#3E523A]' },
  ];

  const spaces: { id: SpaceType | 'all'; label: string }[] = [
    { id: 'all', label: 'الكل' },
    { id: 'small', label: 'صغيرة' },
    { id: 'medium', label: 'متوسطة' },
    { id: 'large', label: 'واسعة' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer sheet */}
      <div className="relative w-full max-h-[85vh] bg-brand-dark border-t border-brand-gold/30 rounded-t-3xl shadow-2xl flex flex-col z-10 overflow-hidden transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="p-4 border-b border-brand-gold/15 flex items-center justify-between bg-brand-surface/80">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} weight="bold" className="text-brand-gold" />
            <h3 className="font-bold text-brand-ivory text-sm">فلترة التصاميم</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onResetFilters}
              className="text-xs text-brand-gold hover:text-brand-champagne flex items-center gap-1 px-2 py-1"
            >
              <ArrowClockwise size={14} />
              <span>إعادة تعيين</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-brand-ivory/70 hover:text-brand-gold"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Filter Options */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Category */}
          <div>
            <p className="text-xs font-bold text-brand-gold mb-2">المساحة أو القسم</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-brand-gold text-brand-dark font-bold shadow-md'
                      : 'bg-brand-surface text-brand-ivory/80 border border-brand-gold/15'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div>
            <p className="text-xs font-bold text-brand-gold mb-2">الأسلوب المعماري</p>
            <div className="flex flex-wrap gap-2">
              {styles.map(st => (
                <button
                  key={st.id}
                  onClick={() => onSelectStyle(st.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedStyle === st.id
                      ? 'bg-brand-gold text-brand-dark font-bold shadow-md'
                      : 'bg-brand-surface text-brand-ivory/80 border border-brand-gold/15'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          {selectedCategory === 'kitchens' || selectedCategory === 'bedrooms' ? (
            <div>
              <p className="text-xs font-bold text-brand-gold mb-2">اللون الغالب</p>
              <div className="flex flex-wrap gap-2">
                {colors.map(col => {
                  const isSelected = selectedColor === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => onSelectColor(col.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border transition-all ${
                        isSelected
                          ? 'bg-brand-gold/20 border-brand-gold text-brand-gold font-bold'
                          : 'bg-brand-surface text-brand-ivory/80 border border-brand-gold/15'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${col.bgClass} inline-block border border-white/20`} />
                      <span>{col.label}</span>
                      {isSelected && <Check size={12} weight="bold" className="text-brand-gold" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-brand-gold/10 border border-brand-gold/25">
              <p className="text-xs font-bold text-brand-gold mb-1">🎨 الألوان وخامات التشطيب</p>
              <p className="text-xs text-brand-champagne/80 leading-relaxed font-light">
                جميع الألوان والدرجات متوفرة، وتُنفّذ حسب اختيارك وطلبك لمطابقة ديكور منزلك.
              </p>
            </div>
          )}

          {/* Space */}
          <div>
            <p className="text-xs font-bold text-brand-gold mb-2">حجم المساحة</p>
            <div className="flex flex-wrap gap-2">
              {spaces.map(sp => (
                <button
                  key={sp.id}
                  onClick={() => onSelectSpace(sp.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedSpace === sp.id
                      ? 'bg-brand-gold text-brand-dark font-bold shadow-md'
                      : 'bg-brand-surface text-brand-ivory/80 border border-brand-gold/15'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting */}
          <div>
            <p className="text-xs font-bold text-brand-gold mb-2">ترتيب حسب</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'newest', label: 'الأحدث' },
                { id: 'most-viewed', label: 'الأكثر مشاهدة' },
                { id: 'most-saved', label: 'الأكثر حفظاً' },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => onSelectSort(s.id as SortType)}
                  className={`p-2 rounded-xl text-xs font-semibold text-center transition-all ${
                    sortBy === s.id
                      ? 'bg-brand-gold text-brand-dark font-bold'
                      : 'bg-brand-surface text-brand-ivory/80 border border-brand-gold/15'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Apply CTA */}
        <div className="p-4 border-t border-brand-gold/15 bg-brand-surface/90">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-gold via-brand-champagne to-brand-gold text-brand-dark font-bold text-xs shadow-luxury-gold hover:opacity-95 transition-all"
          >
            عرض النتائج ({totalResultsCount} تصميم)
          </button>
        </div>
      </div>
    </div>
  );
};
