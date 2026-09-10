import React from 'react';
import { CategoryType, StyleType, ColorType, SpaceType, SortType } from '../../types';
import { SlidersHorizontal, Check, ArrowsDownUp, ArrowClockwise } from '@phosphor-icons/react';

interface FilterBarProps {
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
  onOpenMobileFilters?: () => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
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
  onOpenMobileFilters,
  onResetFilters,
  activeFilterCount,
}) => {
  const categories: { id: CategoryType; label: string; badge?: string }[] = [
    { id: 'kitchens', label: 'مطابخ حديثة', badge: '67' },
    { id: 'bedrooms', label: 'غرف نوم فاخرة', badge: '27' },
    { id: 'wardrobes', label: 'خزائن وغرف غسيل', badge: '20' },
    { id: 'interior-design', label: 'ديكورات وتصميم صالات', badge: '20' },
    { id: 'pvc-doors', label: 'أبواب ونوافذ و PVC', badge: '39' },
  ];

  const styles: { id: StyleType | 'all'; label: string }[] = [
    { id: 'all', label: 'جميع الأنماط' },
    { id: 'modern', label: 'مودرن Modern' },
    { id: 'luxury', label: 'فاخر Luxury' },
    { id: 'minimal', label: 'مينيمال Minimal' },
    { id: 'contemporary', label: 'معاصر Contemporary' },
    { id: 'classic', label: 'كلاسيك Classic' },
  ];

  const colors: { id: ColorType | 'all'; label: string; bgClass: string }[] = [
    { id: 'all', label: 'جميع الألوان', bgClass: 'bg-gradient-to-r from-neutral-200 to-neutral-700' },
    { id: 'white', label: 'أبيض', bgClass: 'bg-white' },
    { id: 'beige', label: 'بيج', bgClass: 'bg-[#DFCAA7]' },
    { id: 'black', label: 'أسود', bgClass: 'bg-black' },
    { id: 'gray', label: 'رمادي', bgClass: 'bg-gray-400' },
    { id: 'wood', label: 'خشبي', bgClass: 'bg-[#9B7C4F]' },
    { id: 'dark', label: 'داكن', bgClass: 'bg-[#043337]' },
    { id: 'green', label: 'أخضر', bgClass: 'bg-[#3E523A]' },
  ];

  const spaces: { id: SpaceType | 'all'; label: string }[] = [
    { id: 'all', label: 'جميع المساحات' },
    { id: 'small', label: 'صغيرة (أقل من 15م²)' },
    { id: 'medium', label: 'متوسطة (15 - 30م²)' },
    { id: 'large', label: 'واسعة (أكثر من 30م²)' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Main Category Pills with Clear High-Contrast Badges */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none max-w-full">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-brand-gold via-brand-champagne to-brand-gold text-brand-dark shadow-luxury-gold ring-2 ring-brand-gold/50 scale-[1.03]'
                    : 'bg-brand-surface/80 text-brand-ivory/90 hover:text-brand-champagne hover:bg-brand-surface border border-brand-gold/25 hover:border-brand-gold/50'
                }`}
              >
                <span>{cat.label}</span>
                {cat.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-black transition-colors ${
                      isSelected
                        ? 'bg-brand-dark/90 text-brand-gold'
                        : 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30'
                    }`}
                  >
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Filter Button trigger */}
        {onOpenMobileFilters && (
          <button
            onClick={onOpenMobileFilters}
            className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-surface border border-brand-gold/30 text-xs font-semibold text-brand-ivory shrink-0 hover:text-brand-gold"
          >
            <SlidersHorizontal size={16} weight="bold" className="text-brand-gold" />
            <span>فلترة</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-brand-gold text-brand-dark text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Desktop Detailed Filter Toolbar */}
      <div className="hidden lg:flex items-center justify-between gap-4 p-4 rounded-2xl bg-brand-surface/40 border border-brand-gold/15 backdrop-blur-md">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Style Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-ivory/60">الأسلوب:</span>
            <select
              value={selectedStyle}
              onChange={e => onSelectStyle(e.target.value as StyleType | 'all')}
              className="bg-brand-dark/90 border border-brand-gold/25 rounded-xl px-3 py-1.5 text-xs text-brand-ivory outline-none hover:border-brand-gold transition-colors cursor-pointer"
            >
              {styles.map(s => (
                <option key={s.id} value={s.id} className="bg-brand-dark text-brand-ivory">
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Color filter swatch pills or notice */}
          {selectedCategory === 'kitchens' || selectedCategory === 'bedrooms' ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-ivory/60">اللون:</span>
              <div className="flex items-center gap-1.5">
                {colors.map(col => {
                  const isSelected = selectedColor === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => onSelectColor(col.id)}
                      className={`relative w-6 h-6 rounded-full border transition-all ${col.bgClass} ${
                        isSelected
                          ? 'border-brand-gold ring-2 ring-brand-gold/60 scale-110'
                          : 'border-white/30 hover:scale-105'
                      }`}
                      title={col.label}
                    >
                      {isSelected && (
                        <Check size={12} weight="bold" className="mx-auto text-brand-gold drop-shadow-md" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-gold/10 border border-brand-gold/25 text-xs text-brand-champagne">
              <span className="text-brand-gold font-bold">🎨 الألوان:</span>
              <span>جميع الألوان متوفرة وتُفصّل حسب طلبك واختيارك</span>
            </div>
          )}

          {/* Space Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-ivory/60">المساحة:</span>
            <select
              value={selectedSpace}
              onChange={e => onSelectSpace(e.target.value as SpaceType | 'all')}
              className="bg-brand-dark/90 border border-brand-gold/25 rounded-xl px-3 py-1.5 text-xs text-brand-ivory outline-none hover:border-brand-gold transition-colors cursor-pointer"
            >
              {spaces.map(sp => (
                <option key={sp.id} value={sp.id} className="bg-brand-dark text-brand-ivory">
                  {sp.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button if active */}
          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-brand-gold hover:text-brand-champagne transition-colors px-2 py-1"
            >
              <ArrowClockwise size={12} weight="bold" />
              <span>إعادة ضبط ({activeFilterCount})</span>
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowsDownUp size={14} weight="bold" className="text-brand-gold" />
          <span className="text-xs text-brand-ivory/60">الترتيب:</span>
          <select
            value={sortBy}
            onChange={e => onSelectSort(e.target.value as SortType)}
            className="bg-brand-dark/90 border border-brand-gold/25 rounded-xl px-3 py-1.5 text-xs text-brand-ivory outline-none hover:border-brand-gold transition-colors cursor-pointer"
          >
            <option value="newest" className="bg-brand-dark">الأحدث إضافة</option>
            <option value="most-viewed" className="bg-brand-dark">الأكثر مشاهدة</option>
            <option value="most-saved" className="bg-brand-dark">الأكثر حفظاً في المفضلة</option>
          </select>
        </div>
      </div>
    </div>
  );
};
