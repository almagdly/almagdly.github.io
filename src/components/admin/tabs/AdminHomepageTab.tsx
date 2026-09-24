import React, { useState } from 'react';
import {
  House,
  Star,
  UploadSimple,
  FloppyDisk,
  CheckCircle,
  MagnifyingGlass,
  Sparkle,
  Check,
  Trash,
  X,
  ArrowUp,
  ArrowDown,
  Plus,
} from '@phosphor-icons/react';
import { DesignItem, CategoryType } from '../../../types';
import { SiteSettings } from '../../../types/admin';
import { adminStore } from '../../../services/adminStore';
import { compressImageFile } from '../../../utils/imageOptimizer';

interface Props {
  designs: DesignItem[];
  settings: SiteSettings;
}

export const AdminHomepageTab: React.FC<Props> = ({ designs, settings }) => {
  // Hero section state
  const [heroImage, setHeroImage] = useState(settings.heroImage || './projects/p1.jpg');
  const [heroTagline, setHeroTagline] = useState(
    settings.heroTagline ||
      'شركة المجد للمطابخ الحديثة، غرف النوم، والديكورات الداخلية — البيضاء'
  );
  const [heroSaveSuccess, setHeroSaveSuccess] = useState(false);

  // Search & filter for adding designs
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');

  const categories: { id: CategoryType; label: string }[] = [
    { id: 'all', label: 'جميع الأقسام' },
    { id: 'kitchens', label: 'مطابخ' },
    { id: 'bedrooms', label: 'غرف نوم' },
    { id: 'pvc-doors', label: 'أبواب و PVC' },
    { id: 'wardrobes', label: 'خزائن' },
    { id: 'interior-design', label: 'ديكورات' },
  ];

  // Curated homepage list
  const homepageIds = settings.homepageDesignIds && settings.homepageDesignIds.length > 0
    ? settings.homepageDesignIds
    : adminStore.getHomepageDesignIds();

  const homepageDesigns = homepageIds
    .map(id => designs.find(d => d.id === id))
    .filter((d): d is DesignItem => Boolean(d));

  const filteredAvailableDesigns = designs.filter(d => {
    if (homepageIds.includes(d.id)) return false;
    if (selectedCategory !== 'all' && d.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        d.title.toLowerCase().includes(q) ||
        (d.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    adminStore.updateSettings({
      heroImage: heroImage.trim(),
      heroTagline: heroTagline.trim(),
    });
    setHeroSaveSuccess(true);
    setTimeout(() => setHeroSaveSuccess(false), 3000);
  };

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const res = await compressImageFile(file, {
        maxWidth: 1600,
        maxHeight: 1000,
        quality: 0.8,
      });
      setHeroImage(res.dataUrl);
    } catch (err) {
      console.error('Error compressing hero banner:', err);
    }
  };

  const handleRemoveFromHomepage = (id: string) => {
    adminStore.removeFromHomepage(id);
  };

  const handleAddToHomepage = (id: string) => {
    adminStore.addToHomepage(id);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...homepageIds];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    adminStore.reorderHomepage(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === homepageIds.length - 1) return;
    const updated = [...homepageIds];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    adminStore.reorderHomepage(updated);
  };

  const handleDeleteDesign = (item: DesignItem) => {
    if (window.confirm(`هل أنت متأكد من حذف تصميم "${item.title}" نهائياً من الموقع؟`)) {
      adminStore.deleteDesign(item.id);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-brand-ivory font-arabic">
          إدارة الصور المعروضة في الصفحة الرئيسية
        </h2>
        <p className="text-xs text-brand-ivory/60">
          التحكم في صورة خلفية البداية (Hero) واختيار المشاريع المميزة التي تظهر للزوار في واجهة الموقع
        </p>
      </div>

      {/* 1. Hero Background Image Section */}
      <div className="p-6 rounded-2xl bg-brand-surface border border-brand-gold/25 space-y-6 shadow-lg">
        <div className="flex items-center justify-between border-b border-brand-gold/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center">
              <House size={20} weight="duotone" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-ivory">
                صورة خلفية واجهة الموقع (Hero Background)
              </h3>
              <p className="text-[11px] text-brand-ivory/60">
                الصورة الكبيرة الأولى التي يراها العميل بمجرد دخول الموقع
              </p>
            </div>
          </div>

          {heroSaveSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle size={16} weight="fill" />
              <span>تم حفظ التغيير!</span>
            </span>
          )}
        </div>

        {/* Hero Preview Box */}
        <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-brand-gold/30 shadow-inner group">
          <img
            src={heroImage}
            alt="Hero Preview"
            className="w-full h-full object-cover"
            onError={e => {
              (e.target as HTMLImageElement).src = './projects/p1.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6">
            <div className="space-y-2 max-w-xl">
              <span className="inline-block px-3 py-1 rounded-full bg-brand-dark/80 border border-brand-gold/30 text-brand-gold text-[10px] font-bold">
                معاينة الواجهة الحالية
              </span>
              <h4 className="text-lg sm:text-2xl font-bold text-white font-arabic leading-tight">
                تصاميم راقية. حلول داخلية متكاملة تليق بك.
              </h4>
              <p className="text-xs text-brand-ivory/80 line-clamp-1">{heroTagline}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <form onSubmit={handleSaveHero} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Direct Image Path / URL */}
            <div className="sm:col-span-8 space-y-1.5">
              <label className="block text-xs font-semibold text-brand-ivory/90">
                مسار أو رابط صورة الهيرو
              </label>
              <input
                type="text"
                value={heroImage}
                onChange={e => setHeroImage(e.target.value)}
                placeholder="./projects/p1.jpg أو رابط مباشر"
                dir="ltr"
                className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs font-mono text-brand-ivory focus:outline-none focus:border-brand-gold"
              />
            </div>

            {/* Upload Button */}
            <div className="sm:col-span-4 flex items-end">
              <label className="cursor-pointer w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-black/40 border border-brand-gold/30 text-brand-champagne hover:bg-brand-gold/15 transition-all flex items-center justify-center gap-2">
                <UploadSimple size={16} weight="bold" />
                <span>رفع صورة من جهازك</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Quick Preset Selector from Top Designs */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-brand-ivory/70 block">
              أو اختر صورة جاهزة بنقرة واحدة من أفضل مشاريع المعرض:
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {designs.slice(0, 8).map(d => {
                const isSelected = heroImage === d.mainImage;
                return (
                  <button
                    type="button"
                    key={d.id}
                    onClick={() => setHeroImage(d.mainImage)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      isSelected
                        ? 'border-brand-gold ring-2 ring-brand-gold/50 scale-105 shadow-md'
                        : 'border-white/10 opacity-70 hover:opacity-100 hover:border-brand-gold/40'
                    }`}
                    title={d.title}
                  >
                    <img src={d.mainImage} alt={d.title} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-brand-gold/30 flex items-center justify-center text-brand-dark">
                        <Check size={16} weight="bold" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-gold to-amber-500 text-brand-dark hover:brightness-110 shadow-lg shadow-brand-gold/20 transition-all"
            >
              <FloppyDisk size={16} weight="bold" />
              <span>تطبيق وحفظ صورة البداية</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Currently Featured Projects on Homepage (المشاريع المعروضة حالياً بالرئيسية) */}
      <div className="p-6 rounded-2xl bg-brand-surface border border-brand-gold/25 space-y-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-gold/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Star size={20} weight="duotone" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-ivory">
                المشاريع المعروضة حالياً في الصفحة الرئيسية
              </h3>
              <p className="text-[11px] text-brand-ivory/60">
                هذه المشاريع تظهر مباشرة للزوار في واجهة الموقع. يمكنك حذفها، إزالتها، أو إعادة ترتيبها.
              </p>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-brand-gold/20 text-xs text-brand-gold font-bold flex items-center gap-2">
            <span>المعروض حالياً:</span>
            <span className="font-mono text-white text-sm">{homepageDesigns.length}</span>
            <span>تصميم</span>
          </div>
        </div>

        {homepageDesigns.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-black/20 border border-dashed border-white/10 text-brand-ivory/50 text-xs">
            لم يتم اختيار أي مشاريع لعرضها بالرئيسية حالياً. اختر من القائمة أدناه لإضافتها.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {homepageDesigns.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-brand-gold/30 hover:border-brand-gold/60 transition-all shadow-md group"
              >
                {/* Thumbnail & Position */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-neutral-900 border border-white/10">
                  <img
                    src={item.mainImage}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={e => {
                      (e.target as HTMLImageElement).src = './projects/p1.jpg';
                    }}
                  />
                  <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-brand-gold">
                    #{index + 1}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-xs font-bold text-brand-ivory truncate">{item.title}</h4>
                  <p className="text-[10px] text-brand-gold truncate">{item.categoryArabic}</p>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleRemoveFromHomepage(item.id)}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30 flex items-center gap-1 transition-all"
                      title="إزالة هذا المشروع من الظهور في الصفحة الرئيسية"
                    >
                      <X size={12} weight="bold" />
                      <span>إزالة من الرئيسية</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteDesign(item)}
                      className="p-1 rounded-lg text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/20 transition-all"
                      title="حذف هذا التصميم نهائياً من الموقع"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>

                {/* Reorder Buttons */}
                <div className="flex flex-col gap-1 shrink-0 border-r border-white/10 pr-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveUp(index)}
                    className="p-1 rounded bg-white/5 hover:bg-brand-gold/20 text-brand-ivory/70 hover:text-brand-gold disabled:opacity-20 disabled:pointer-events-none transition-all"
                    title="تحريك للأعلى"
                  >
                    <ArrowUp size={12} weight="bold" />
                  </button>
                  <button
                    type="button"
                    disabled={index === homepageDesigns.length - 1}
                    onClick={() => handleMoveDown(index)}
                    className="p-1 rounded bg-white/5 hover:bg-brand-gold/20 text-brand-ivory/70 hover:text-brand-gold disabled:opacity-20 disabled:pointer-events-none transition-all"
                    title="تحريك للأسفل"
                  >
                    <ArrowDown size={12} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Add More Designs to Homepage (إضافة تصاميم إلى الصفحة الرئيسية) */}
      <div className="p-6 rounded-2xl bg-brand-surface border border-brand-gold/25 space-y-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-gold/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Plus size={20} weight="bold" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-ivory">
                إضافة تصاميم جديدة إلى الصفحة الرئيسية
              </h3>
              <p className="text-[11px] text-brand-ivory/60">
                اختر أي تصميم من المعرض واضغط على "إضافة للرئيسية" ليظهر فوراً في واجهة الموقع
              </p>
            </div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-brand-ivory/40">
              <MagnifyingGlass size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث عن تصميم بالاسم أو الوسم لإضافته..."
              className="w-full pl-4 pr-10 py-2.5 bg-black/40 border border-brand-gold/25 rounded-xl text-xs text-brand-ivory placeholder:text-brand-ivory/30 focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as CategoryType)}
              className="w-full px-3.5 py-2.5 bg-black/40 border border-brand-gold/25 rounded-xl text-xs text-brand-ivory focus:outline-none focus:border-brand-gold"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id} className="bg-neutral-900 text-white">
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Available Designs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-1">
          {filteredAvailableDesigns.length === 0 ? (
            <div className="col-span-full py-8 text-center text-xs text-brand-ivory/40">
              لا توجد تصاميم مطابقة للبحث أو أن جميع التصاميم المختارة مضافة للرئيسية بالفعل.
            </div>
          ) : (
            filteredAvailableDesigns.map(item => (
              <div
                key={item.id}
                className="relative rounded-xl overflow-hidden border border-white/10 hover:border-brand-gold/40 p-2.5 bg-black/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-2 bg-black/40">
                    <img
                      src={item.mainImage}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLImageElement).src = './projects/p1.jpg';
                      }}
                    />
                  </div>

                  <div className="space-y-0.5 mb-3">
                    <h4 className="text-xs font-bold text-brand-ivory truncate">{item.title}</h4>
                    <p className="text-[10px] text-brand-gold truncate">{item.categoryArabic}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-1 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => handleAddToHomepage(item.id)}
                    className="flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1 transition-all"
                  >
                    <Plus size={12} weight="bold" />
                    <span>إضافة للرئيسية</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteDesign(item)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-all"
                    title="حذف هذا التصميم نهائياً من الموقع"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
