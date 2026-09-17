import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDesigns } from '../../hooks/useAdminStore';
import { CategoryType, StyleType, ColorType, SpaceType, DesignItem } from '../../types';
import { 
  ArrowLeft, 
  ArrowRight, 
  ArrowClockwise, 
  Check, 
  CheckCircle,
  CookingPot,
  Bed,
  Armchair,
  Storefront,
  Briefcase,
  HouseLine,
  Door
} from '@phosphor-icons/react';

export const DiscoveryWizard: React.FC = () => {
  const designsData = useAdminDesigns();
  const [currentStep, setCurrentStep] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState<CategoryType | ''>('kitchens');
  const [selectedStyle, setSelectedStyle] = useState<StyleType | ''>('luxury');
  const [selectedColor, setSelectedColor] = useState<ColorType | ''>('beige');
  const [selectedSpace, setSelectedSpace] = useState<SpaceType | ''>('medium');
  const [isCompleted, setIsCompleted] = useState(false);

  const navigate = useNavigate();

  const step1Options: { id: CategoryType; label: string; icon: React.ReactNode }[] = [
    { id: 'kitchens', label: 'مطبخ عصري', icon: <CookingPot size={24} weight="duotone" className="text-brand-gold" /> },
    { id: 'bedrooms', label: 'غرفة نوم فاخرة', icon: <Bed size={24} weight="duotone" className="text-brand-gold" /> },
    { id: 'living-rooms', label: 'غرفة معيشة أو مجلس', icon: <Armchair size={24} weight="duotone" className="text-brand-gold" /> },
    { id: 'shops', label: 'محل أو معرض تجاري', icon: <Storefront size={24} weight="duotone" className="text-brand-gold" /> },
    { id: 'offices', label: 'مكتب أو بيئة عمل', icon: <Briefcase size={24} weight="duotone" className="text-brand-gold" /> },
    { id: 'home-decor', label: 'ديكور منزل متكامل', icon: <HouseLine size={24} weight="duotone" className="text-brand-gold" /> },
    { id: 'wardrobes', label: 'خزانة ملابس (Closet)', icon: <Door size={24} weight="duotone" className="text-brand-gold" /> },
  ];

  const step2Options: { id: StyleType; label: string; labelEn: string; desc: string }[] = [
    { id: 'luxury', label: 'فاخر ومترف', labelEn: 'Luxury', desc: 'رخام طبيعي، إضاءات مخفية ولمسات مذهبة' },
    { id: 'modern', label: 'مودرن حديث', labelEn: 'Modern', desc: 'خطوط أنيقة وعملية تجمع بين الخشب والزجاج' },
    { id: 'minimal', label: 'مينيمال بسيط', labelEn: 'Minimal', desc: 'بساطة فائقة، أسطح نقية وخزائن مخفية' },
    { id: 'contemporary', label: 'معاصر جريء', labelEn: 'Contemporary', desc: 'تناغم الألوان الجريئة والمواد المعمارية' },
    { id: 'classic', label: 'كلاسيك راقٍ', labelEn: 'Classic', desc: 'تفاصيل شيكر وأخشاب زان ذات طابع خالد' },
  ];

  const step3Options: { id: ColorType; label: string; colorHex: string }[] = [
    { id: 'white', label: 'أبيض ناصع / عاجي', colorHex: '#F6F1E8' },
    { id: 'beige', label: 'بيج دافئ / شمبانيا', colorHex: '#DFCAA7' },
    { id: 'wood', label: 'أخشاب دافئة (جوز وبلوط)', colorHex: '#9B7C4F' },
    { id: 'dark', label: 'تيل داكن / أخضر زمردي', colorHex: '#043337' },
    { id: 'black', label: 'أسود فحمي فاخر', colorHex: '#1A1A1A' },
    { id: 'gray', label: 'رمادي حجري وأسمنتي', colorHex: '#737373' },
  ];

  const step4Options: { id: SpaceType; label: string; desc: string }[] = [
    { id: 'small', label: 'مساحة صغيرة', desc: 'أقل من 15 متر مربع (حلول ذكية لاستغلال الفراغ)' },
    { id: 'medium', label: 'مساحة متوسطة', desc: 'بين 15 إلى 30 متر مربع (توازن مثالي بين الراحة والرحابة)' },
    { id: 'large', label: 'مساحة واسعة', desc: 'أكثر من 30 متر مربع (فلل، أجنحة مفتوحة، جزر ضخمة)' },
  ];

  const getMatchingDesigns = (): DesignItem[] => {
    return designsData
      .filter(d => {
        let matchCount = 0;
        if (selectedCategory && d.category === selectedCategory) matchCount += 3;
        if (selectedStyle && d.style === selectedStyle) matchCount += 2;
        if (selectedColor && d.colors.includes(selectedColor as ColorType)) matchCount += 2;
        if (selectedSpace && d.space === selectedSpace) matchCount += 1;
        return matchCount >= 2;
      })
      .slice(0, 3);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setIsCompleted(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setIsCompleted(false);
    setSelectedCategory('kitchens');
    setSelectedStyle('luxury');
    setSelectedColor('beige');
    setSelectedSpace('medium');
  };

  const matchingResults = getMatchingDesigns();

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-brand-dark via-brand-surface/30 to-brand-dark border-t border-brand-gold/15 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-ivory tracking-tight font-arabic">
            ابحث عن <span className="text-gold-gradient">تصميمك المثالي</span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-ivory/70 mt-2">
            أجب عن 4 أسئلة بسيطة لنقترح عليك التصاميم والأنماط الأنسب لمساحتك وذوقك الخاص
          </p>
        </div>

        {/* Wizard Container Card */}
        <div className="bg-brand-surface/70 border border-brand-gold/30 rounded-3xl p-6 sm:p-10 shadow-luxury backdrop-blur-xl">
          
          {/* Progress Steps Header */}
          {!isCompleted && (
            <div className="flex items-center justify-between gap-2 mb-8 pb-6 border-b border-brand-gold/15">
              {[
                { step: 1, title: 'نوع المساحة' },
                { step: 2, title: 'الأسلوب' },
                { step: 3, title: 'الألوان' },
                { step: 4, title: 'الحجم' },
              ].map(s => {
                const isActive = currentStep === s.step;
                const isPassed = currentStep > s.step;
                return (
                  <div key={s.step} className="flex-1 flex flex-col items-center text-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1.5 ${
                        isActive
                          ? 'bg-brand-gold text-brand-dark ring-4 ring-brand-gold/20 scale-110'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-brand-dark/80 text-brand-ivory/40 border border-brand-gold/10'
                      }`}
                    >
                      {isPassed ? <Check size={14} weight="bold" /> : s.step}
                    </div>
                    <span className={`text-[11px] font-medium hidden sm:inline ${isActive ? 'text-brand-gold font-bold' : 'text-brand-ivory/60'}`}>
                      {s.title}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Steps Content */}
          {!isCompleted ? (
            <div className="min-h-[260px] flex flex-col justify-between">
              
                {/* Step 1 */}
                {currentStep === 1 && (
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-brand-ivory mb-1.5">
                      1. ماذا تريد أن تصمم؟
                    </h3>
                    <p className="text-xs text-brand-ivory/60 mb-5">
                      حدد الفراغ الذي ترغب في تجديده أو تصميمه
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {step1Options.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedCategory(opt.id)}
                          className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 ${
                            selectedCategory === opt.id
                              ? 'bg-brand-gold/15 border-brand-gold text-brand-gold ring-1 ring-brand-gold'
                              : 'bg-brand-dark/60 border-brand-gold/15 text-brand-ivory/80 hover:border-brand-gold/40'
                          }`}
                        >
                          <div>{opt.icon}</div>
                          <span className="text-xs sm:text-sm font-bold">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {currentStep === 2 && (
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-brand-ivory mb-1.5">
                      2. ما هو الأسلوب المعماري الذي تفضله؟
                    </h3>
                    <p className="text-xs text-brand-ivory/60 mb-5">
                      اختر الروح العامة التي ترغب برؤيتها في المساحة
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {step2Options.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedStyle(opt.id)}
                          className={`p-4 rounded-2xl border text-right transition-all space-y-1.5 ${
                            selectedStyle === opt.id
                              ? 'bg-brand-gold/15 border-brand-gold text-brand-gold ring-1 ring-brand-gold'
                              : 'bg-brand-dark/60 border-brand-gold/15 text-brand-ivory/80 hover:border-brand-gold/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs sm:text-sm font-bold text-brand-ivory">{opt.label}</h4>
                            <span className="text-[10px] font-serif text-brand-gold/80">{opt.labelEn}</span>
                          </div>
                          <p className="text-[11px] text-brand-ivory/60 leading-relaxed">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {currentStep === 3 && (
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-brand-ivory mb-1.5">
                      3. ما هي درجات الألوان التي تميل إليها؟
                    </h3>
                    <p className="text-xs text-brand-ivory/60 mb-5">
                      باليت الألوان التي تناسب أسلوب حياتك
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {step3Options.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedColor(opt.id)}
                          className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all text-right ${
                            selectedColor === opt.id
                              ? 'bg-brand-gold/15 border-brand-gold ring-1 ring-brand-gold'
                              : 'bg-brand-dark/60 border-brand-gold/15 hover:border-brand-gold/40'
                          }`}
                        >
                          <span
                            className="w-6 h-6 rounded-full border border-white/30 shrink-0 shadow-inner"
                            style={{ backgroundColor: opt.colorHex }}
                          />
                          <span className="text-xs font-semibold text-brand-ivory">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4 */}
                {currentStep === 4 && (
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-brand-ivory mb-1.5">
                      4. ما هو الحجم التقريبي لمساحتك؟
                    </h3>
                    <p className="text-xs text-brand-ivory/60 mb-5">
                      يساعدنا ذلك على اقتراح تصاميم مناسبة للأبعاد
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {step4Options.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedSpace(opt.id)}
                          className={`p-4 rounded-2xl border text-right transition-all space-y-1.5 ${
                            selectedSpace === opt.id
                              ? 'bg-brand-gold/15 border-brand-gold text-brand-gold ring-1 ring-brand-gold'
                              : 'bg-brand-dark/60 border-brand-gold/15 text-brand-ivory/80 hover:border-brand-gold/40'
                          }`}
                        >
                          <h4 className="text-xs sm:text-sm font-bold text-brand-ivory">{opt.label}</h4>
                          <p className="text-[11px] text-brand-ivory/60 leading-relaxed">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between gap-4 mt-6 pt-5 border-t border-brand-gold/15">
                  {currentStep > 1 ? (
                    <button
                      onClick={handlePrev}
                      className="px-4 py-2 rounded-xl border border-brand-gold/30 text-brand-ivory hover:text-brand-gold text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowRight size={14} />
                      <span>السابق</span>
                    </button>
                  ) : <div />}

                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-champagne to-brand-gold text-brand-dark font-bold text-xs shadow-luxury-gold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
                  >
                    <span>{currentStep === 4 ? 'عرض التصاميم المقترحة' : 'التالي'}</span>
                    <ArrowLeft size={14} weight="bold" />
                  </button>
                </div>
              </div>
            ) : (
              /* Results Area */
              <div
                className="space-y-6 animate-fade-in"
              >
                <div className="flex items-center justify-between pb-4 border-b border-brand-gold/15">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={24} weight="duotone" className="text-emerald-400 shrink-0" />
                    <div>
                      <h3 className="text-base font-bold text-brand-ivory">وجدنا لك تصاميم تناسب اختياراتك</h3>
                      <p className="text-xs text-brand-champagne/80">بناءً على تفضيلاتك من حيث المساحة، الأسلوب، والألوان</p>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="text-xs text-brand-gold hover:text-brand-champagne flex items-center gap-1 transition-colors"
                  >
                    <ArrowClockwise size={14} />
                    <span>تعديل الاختيارات</span>
                  </button>
                </div>

                {/* Matching Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {matchingResults.map(design => (
                    <div
                      key={design.id}
                      onClick={() => navigate(`/designs/${design.slug}`)}
                      className="group cursor-pointer rounded-xl overflow-hidden bg-brand-dark/80 border border-brand-gold/20 hover:border-brand-gold transition-all"
                    >
                      <div className="relative h-36 overflow-hidden">
                        <img
                          src={design.mainImage}
                          alt={design.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-brand-dark/80 text-brand-gold">
                          {design.styleArabic}
                        </span>
                      </div>
                      <div className="p-3.5">
                        <h4 className="text-xs font-bold text-brand-ivory group-hover:text-brand-gold transition-colors truncate">
                          {design.title}
                        </h4>
                        <div className="flex items-center justify-between mt-2 text-[11px] text-brand-ivory/60">
                          <span>{design.categoryArabic}</span>
                          <span className="text-brand-gold font-semibold">عرض التفاصيل ←</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-brand-gold/15">
                  <button
                    onClick={() => navigate(`/designs?category=${selectedCategory}`)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-surface border border-brand-gold/40 text-brand-ivory hover:text-brand-gold text-xs font-semibold transition-all"
                  >
                    تصفح جميع تصاميم هذا القسم
                  </button>

                  <button
                    onClick={() => navigate('/request')}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-champagne to-brand-gold text-brand-dark text-xs font-bold shadow-luxury-gold hover:opacity-95 transition-all"
                  >
                    طلب تنفيذ تصميم مخصص لمساحتي
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </section>
  );
};
