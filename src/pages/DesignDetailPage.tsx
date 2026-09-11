import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdminDesigns } from '../hooks/useAdminStore';
import { useFavorites } from '../context/FavoritesContext';
import { getWhatsAppUrl, getDesignInquiryMessage } from '../utils/whatsapp';
import { SimilarDesigns } from '../components/gallery/SimilarDesigns';
import { FullscreenViewer } from '../components/viewer/FullscreenViewer';
import { ShareModal } from '../components/viewer/ShareModal';
import { 
  Heart, 
  ShareNetwork, 
  WhatsappLogo, 
  ArrowsOut, 
  CheckCircle, 
  Ruler, 
  Compass,
  Palette,
  CaretRight,
  CaretLeft
} from '@phosphor-icons/react';

export const DesignDetailPage: React.FC = () => {
  const designsData = useAdminDesigns();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const touchStartX = React.useRef<number>(0);
  const touchStartY = React.useRef<number>(0);
  const touchEndX = React.useRef<number>(0);
  const touchEndY = React.useRef<number>(0);
  const isDragging = React.useRef<boolean>(false);

  const design = designsData.find(d => d.slug === slug);

  if (!design) {
    return (
      <div className="pt-32 pb-24 text-center min-h-[70vh] flex flex-col items-center justify-center bg-brand-dark px-4">
        <h2 className="text-xl font-bold text-brand-ivory mb-2">التصميم غير موجود</h2>
        <p className="text-xs text-brand-ivory/60 mb-6">قد يكون تم تغيير الرابط أو نقل التصميم إلى قسم آخر</p>
        <Link
          to="/designs"
          className="px-6 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs shadow-luxury-gold hover:bg-brand-champagne transition-all"
        >
          العودة لمعرض التصاميم
        </Link>
      </div>
    );
  }

  const isFav = isFavorite(design.id);
  const gallery = design.galleryImages && design.galleryImages.length > 0 ? design.galleryImages : [design.mainImage];
  const whatsAppUrl = getWhatsAppUrl(getDesignInquiryMessage(design));

  const categoryDesigns = designsData.filter(d => d.category === design.category);
  const currentCategoryIndex = categoryDesigns.findIndex(d => d.id === design.id);

  const handleNext = () => {
    if (gallery.length > 1 && activeImageIndex < gallery.length - 1) {
      setActiveImageIndex(prev => prev + 1);
    } else if (categoryDesigns.length > 1 && currentCategoryIndex !== -1) {
      const nextIndex = (currentCategoryIndex + 1) % categoryDesigns.length;
      navigate(`/designs/${categoryDesigns[nextIndex].slug}`);
      setActiveImageIndex(0);
    } else if (gallery.length > 1) {
      setActiveImageIndex(0);
    }
  };

  const handlePrev = () => {
    if (gallery.length > 1 && activeImageIndex > 0) {
      setActiveImageIndex(prev => prev - 1);
    } else if (categoryDesigns.length > 1 && currentCategoryIndex !== -1) {
      const prevIndex = (currentCategoryIndex - 1 + categoryDesigns.length) % categoryDesigns.length;
      navigate(`/designs/${categoryDesigns[prevIndex].slug}`);
      setActiveImageIndex(0);
    } else if (gallery.length > 1) {
      setActiveImageIndex(gallery.length - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = touchStartY.current - touchEndY.current;
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX > 0) {
        handleNext(); // Swipe Left -> Next
      } else {
        handlePrev(); // Swipe Right -> Prev
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    touchStartX.current = e.clientX;
    touchEndX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    touchEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const deltaX = touchStartX.current - touchEndX.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  return (
    <div className="pt-28 pb-20 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-brand-ivory/60 mb-6 overflow-x-auto pb-1 font-light">
          <Link to="/" className="hover:text-brand-gold transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link to="/designs" className="hover:text-brand-gold transition-colors">التصاميم</Link>
          <span>/</span>
          <Link to={`/designs?category=${design.category}`} className="hover:text-brand-gold transition-colors">
            {design.categoryArabic}
          </Link>
          <span>/</span>
          <span className="text-brand-gold truncate max-w-xs font-semibold">{design.title}</span>
        </div>

        {/* Visuals Gallery (7 cols) + Meta (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          
          {/* Visual Gallery with Swipe & Navigation */}
          <div className="lg:col-span-7 space-y-3">
            <div
              onClick={() => setIsViewerOpen(true)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden border border-brand-gold/30 shadow-2xl cursor-pointer group bg-brand-dark select-none touch-pan-y"
            >
              <img
                src={gallery[activeImageIndex]}
                alt={design.title}
                draggable={false}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" />

              {/* Navigation Arrows on Main Image */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-dark/85 hover:bg-brand-gold hover:text-brand-dark border border-brand-gold/40 text-brand-ivory transition-all backdrop-blur-md shadow-xl flex items-center justify-center z-20 group/btn"
                aria-label="السابق (تحريك لليمين)"
                title="السابق"
              >
                <CaretRight size={20} weight="bold" className="group-hover/btn:scale-110 transition-transform" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-dark/85 hover:bg-brand-gold hover:text-brand-dark border border-brand-gold/40 text-brand-ivory transition-all backdrop-blur-md shadow-xl flex items-center justify-center z-20 group/btn"
                aria-label="التالي (تحريك لليسار)"
                title="التالي"
              >
                <CaretLeft size={20} weight="bold" className="group-hover/btn:scale-110 transition-transform" />
              </button>

              {/* Badges */}
              <div className="absolute top-4 right-4 flex items-center gap-2 pointer-events-none">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-dark/85 backdrop-blur-md text-brand-gold border border-brand-gold/30 shadow-md">
                  {design.categoryArabic}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-dark/85 backdrop-blur-md text-brand-champagne border border-brand-gold/20 shadow-md">
                  {design.styleArabic}
                </span>
              </div>

              {/* Swipe Instruction Badge & Fullscreen Hint */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-none z-10">
                <div className="p-2 sm:p-2.5 rounded-xl bg-brand-dark/80 hover:bg-brand-gold text-brand-ivory hover:text-brand-dark backdrop-blur-md border border-brand-gold/30 transition-all flex items-center gap-1.5 text-xs font-semibold shadow-lg pointer-events-auto">
                  <ArrowsOut size={15} weight="bold" />
                  <span>تكبير الصورة</span>
                </div>

                <span className="text-[10px] sm:text-xs text-brand-champagne/90 bg-brand-dark/85 px-3 py-1 rounded-full border border-brand-gold/20 backdrop-blur-md">
                  اسحب لليمين أو اليسار للتنقل
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? 'border-brand-gold scale-105 shadow-luxury-gold'
                        : 'border-brand-gold/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Design Info & Instant WhatsApp CTA */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="text-[11px] font-serif text-brand-gold tracking-widest uppercase">
                {design.titleEn || 'AL MAGD SIGNATURE DESIGN'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ivory leading-snug font-arabic mt-1">
                {design.title}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-brand-ivory/80 leading-relaxed font-light">
              {design.description}
            </p>

            {/* Large WhatsApp CTA Button (Immediate & Friction-Free) */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-[#25D366] text-white font-extrabold text-sm sm:text-base shadow-luxury hover:bg-[#20bd5a] hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <WhatsappLogo size={22} weight="fill" />
              <span>اطلب هذا التصميم عبر واتساب</span>
            </a>

            {/* Color Customization Note for non-kitchen/bedroom designs or color display */}
            {design.category !== 'kitchens' && design.category !== 'bedrooms' ? (
              <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-brand-gold/10 border border-brand-gold/30">
                <div className="w-8 h-8 rounded-xl bg-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0 mt-0.5">
                  <Palette size={20} weight="duotone" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-brand-gold">
                    اللون حسب الطلب • جميع الألوان متوفرة
                  </p>
                  <p className="text-xs text-brand-ivory/80 leading-relaxed font-light">
                    اللون الموضح في الصورة هو نموذج للتصميم فقط؛ يمكنك اختيار وتنفيذ هذا الموديل بأي لون أو درجة تشطيب تفضلها لتناسب ديكور منزلك.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-brand-champagne/90 p-3 rounded-xl bg-brand-surface/40 border border-brand-gold/15">
                <Palette size={16} className="text-brand-gold shrink-0" />
                <span><strong>الألوان الموضحة في النموذج:</strong> {design.colorsArabic.join(' • ')}</span>
              </div>
            )}

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-brand-surface/40 border border-brand-gold/20">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[11px] text-brand-gold">
                  <Ruler size={13} weight="duotone" />
                  <span>المساحة التقريبية</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-brand-ivory">{design.approximateArea} ({design.spaceArabic})</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[11px] text-brand-gold">
                  <Compass size={13} weight="duotone" />
                  <span>الأسلوب المعماري</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-brand-ivory">{design.styleArabic}</p>
              </div>
            </div>

            {/* Materials */}
            <div>
              <p className="text-xs font-bold text-brand-gold mb-2">الخامات والمواد الأساسية:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {design.materials.map((mat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-brand-ivory/80">
                    <CheckCircle size={14} weight="fill" className="text-brand-gold shrink-0" />
                    <span>{mat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite & Share */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => toggleFavorite(design.id)}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  isFav
                    ? 'bg-brand-gold/20 border-brand-gold text-brand-gold'
                    : 'bg-brand-surface/60 border-brand-gold/20 text-brand-ivory hover:text-brand-gold'
                }`}
              >
                <Heart size={16} weight={isFav ? "fill" : "regular"} className={isFav ? 'text-brand-gold' : ''} />
                <span>{isFav ? 'محفوظ في المفضلة' : 'حفظ التصميم'}</span>
              </button>

              <button
                onClick={() => setIsShareOpen(true)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-brand-surface/60 border border-brand-gold/20 text-brand-ivory hover:text-brand-gold text-xs font-semibold transition-all"
              >
                <ShareNetwork size={16} />
                <span>مشاركة</span>
              </button>
            </div>

          </div>

        </div>

        {/* Similar Designs */}
        <SimilarDesigns
          currentDesign={design}
          onQuickView={(d) => {
            navigate(`/designs/${d.slug}`);
          }}
        />

      </div>

      <FullscreenViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        design={design}
        onSelectDesign={(newDesign) => {
          navigate(`/designs/${newDesign.slug}`);
        }}
        allDesigns={categoryDesigns.length > 1 ? categoryDesigns : designsData}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        design={design}
      />
    </div>
  );
};
