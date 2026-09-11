import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAdminDesigns } from '../hooks/useAdminStore';
import { DesignItem, CategoryType, StyleType, ColorType, SpaceType, SortType } from '../types';
import { DesignCard } from '../components/gallery/DesignCard';
import { FilterBar } from '../components/gallery/FilterBar';
import { MobileFilterDrawer } from '../components/gallery/MobileFilterDrawer';
import { FullscreenViewer } from '../components/viewer/FullscreenViewer';
import { ImageSquare, WhatsappLogo, Sparkle } from '@phosphor-icons/react';

export const DesignsPage: React.FC = () => {
  const designsData = useAdminDesigns();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL State initialization
  const categoryParam = searchParams.get('category') as CategoryType;
  const initialCategory: CategoryType = (categoryParam && categoryParam !== 'all') ? categoryParam : 'kitchens';
  const styleParam = (searchParams.get('style') as StyleType | 'all') || 'all';
  const colorParam = (searchParams.get('color') as ColorType | 'all') || 'all';
  const spaceParam = (searchParams.get('space') as SpaceType | 'all') || 'all';
  const sortParam = (searchParams.get('sort') as SortType) || 'newest';

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(initialCategory);
  const [selectedStyle, setSelectedStyle] = useState<StyleType | 'all'>(styleParam);
  const [selectedColor, setSelectedColor] = useState<ColorType | 'all'>(colorParam);
  const [selectedSpace, setSelectedSpace] = useState<SpaceType | 'all'>(spaceParam);
  const [sortBy, setSortBy] = useState<SortType>(sortParam);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedViewerDesign, setSelectedViewerDesign] = useState<DesignItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Sync state to URL params
  useEffect(() => {
    const params: Record<string, string> = {
      category: selectedCategory,
    };
    if (selectedStyle !== 'all') params.style = selectedStyle;
    if (selectedColor !== 'all') params.color = selectedColor;
    if (selectedSpace !== 'all') params.space = selectedSpace;
    if (sortBy !== 'newest') params.sort = sortBy;

    setSearchParams(params, { replace: true });
  }, [selectedCategory, selectedStyle, selectedColor, selectedSpace, sortBy, setSearchParams]);

  // Sync URL params when back/forward is used
  useEffect(() => {
    const cat = searchParams.get('category') as CategoryType;
    setSelectedCategory((cat && cat !== 'all') ? cat : 'kitchens');
    setSelectedStyle((searchParams.get('style') as StyleType | 'all') || 'all');
    setSelectedColor((searchParams.get('color') as ColorType | 'all') || 'all');
    setSelectedSpace((searchParams.get('space') as SpaceType | 'all') || 'all');
    setSortBy((searchParams.get('sort') as SortType) || 'newest');
  }, [searchParams]);

  // Filter & Sort Logic
  const filteredDesigns = useMemo(() => {
    return designsData
      .filter(item => {
        if (item.category !== selectedCategory) return false;
        if (selectedStyle !== 'all' && item.style !== selectedStyle) return false;
        if ((selectedCategory === 'kitchens' || selectedCategory === 'bedrooms') && selectedColor !== 'all' && !item.colors.includes(selectedColor)) return false;
        if (selectedSpace !== 'all' && item.space !== selectedSpace) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'most-viewed') return b.views - a.views;
        if (sortBy === 'most-saved') return b.favoritesCount - a.favoritesCount;
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      });
  }, [selectedCategory, selectedStyle, selectedColor, selectedSpace, sortBy]);

  const activeFilterCount = (selectedStyle !== 'all' ? 1 : 0) +
    ((selectedCategory === 'kitchens' || selectedCategory === 'bedrooms') && selectedColor !== 'all' ? 1 : 0) +
    (selectedSpace !== 'all' ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedStyle('all');
    setSelectedColor('all');
    setSelectedSpace('all');
    setSortBy('newest');
  };

  const handleQuickView = (design: DesignItem) => {
    setSelectedViewerDesign(design);
    setIsViewerOpen(true);
  };

  return (
    <div className="pt-28 pb-20 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-ivory tracking-tight font-arabic">
            معرض التصاميم
          </h1>
          <p className="text-xs sm:text-sm text-brand-ivory/70 mt-2.5 leading-relaxed font-light">
            تصفح أقسام تصاميمنا الحصرية من المطابخ وغرف النوم والخزائن واختر الأسلوب الأنسب لمساحتك
          </p>
        </div>

        {/* Categories & Filter Toolbar (Search Removed for Simplicity & Clarity) */}
        <div className="mb-8">
          <FilterBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedStyle={selectedStyle}
            onSelectStyle={setSelectedStyle}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
            selectedSpace={selectedSpace}
            onSelectSpace={setSelectedSpace}
            sortBy={sortBy}
            onSelectSort={setSortBy}
            onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
            onResetFilters={handleResetFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between pb-3 mb-8 border-b border-brand-gold/15 text-xs text-brand-ivory/60">
          <div className="flex items-center gap-2">
            <span>تم العثور على</span>
            <span className="font-bold text-brand-gold text-sm">{filteredDesigns.length}</span>
            <span>تصميم</span>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-brand-gold hover:text-brand-champagne transition-colors underline"
            >
              مسح جميع الفلاتر
            </button>
          )}
        </div>

        {/* Designs Gallery Grid */}
        {filteredDesigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredDesigns.map(design => (
              <DesignCard
                key={design.id}
                design={design}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        ) : (
          /* Empty State or Coming Soon for Pending Category */
          selectedCategory !== 'all' && selectedCategory !== 'kitchens' && selectedCategory !== 'bedrooms' && selectedCategory !== 'wardrobes' && selectedCategory !== 'interior-design' && selectedCategory !== 'pvc-doors' ? (
            <div className="py-14 sm:py-16 text-center space-y-5 max-w-lg mx-auto bg-brand-surface/50 border border-brand-gold/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
              <div className="w-16 h-16 rounded-2xl bg-brand-surface border border-brand-gold/40 flex items-center justify-center text-brand-gold mx-auto shadow-luxury-gold">
                <Sparkle size={32} weight="duotone" />
              </div>
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-brand-gold/15 text-brand-gold border border-brand-gold/30 inline-block">
                  قيد تجهيز ألبوم الصور وسيتم إضافتها قريباً
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-brand-ivory font-arabic">
                  تصاميم هذا القسم
                </h3>
                <p className="text-xs sm:text-sm text-brand-ivory/70 leading-relaxed font-light">
                  نقوم حالياً بتجهيز صور ومشاريع هذا القسم لإضافتها في الموقع. يمكنك التواصل معنا مباشرة لطلب نماذج الكتالوج الخاص وتفصيل تصميم مخصص لمساحتك عبر واتساب.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/218945919679?text=${encodeURIComponent('السلام عليكم شركة المجد، أود الاستفسار وطلب كتالوج وتصاميم شركة المجد')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-bold text-xs shadow-luxury hover:bg-[#20bd5a] transition-all"
                >
                  <WhatsappLogo size={18} weight="fill" />
                  <span>طلب الكتالوج عبر واتساب</span>
                </a>

                <button
                  onClick={handleResetFilters}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-brand-surface border border-brand-gold/30 text-brand-ivory hover:text-brand-gold font-bold text-xs transition-all"
                >
                  إعادة ضبط فلاتر التصفية
                </button>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-brand-surface border border-brand-gold/20 flex items-center justify-center text-brand-gold/60 mx-auto">
                <ImageSquare size={28} weight="duotone" />
              </div>
              <h3 className="text-base font-bold text-brand-ivory">لا توجد تصاميم مطابقة لهذا الاختيار</h3>
              <p className="text-xs text-brand-ivory/60 leading-relaxed">
                جرّب تغيير خيارات النمط أو اللون أو المساحة لاستعراض المزيد من الخيارات
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs shadow-luxury-gold hover:bg-brand-champagne transition-all"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          )
        )}

      </div>

      {/* Mobile Filters Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedStyle={selectedStyle}
        onSelectStyle={setSelectedStyle}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
        selectedSpace={selectedSpace}
        onSelectSpace={setSelectedSpace}
        sortBy={sortBy}
        onSelectSort={setSortBy}
        onResetFilters={handleResetFilters}
        totalResultsCount={filteredDesigns.length}
      />

      {/* Global Fullscreen Lightbox */}
      <FullscreenViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        design={selectedViewerDesign}
        onSelectDesign={setSelectedViewerDesign}
        allDesigns={filteredDesigns}
      />
    </div>
  );
};
