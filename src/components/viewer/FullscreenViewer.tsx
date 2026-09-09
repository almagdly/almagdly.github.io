import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  CaretRight, 
  CaretLeft, 
  MagnifyingGlassPlus, 
  MagnifyingGlassMinus, 
  ArrowCounterClockwise, 
  Heart, 
  ShareNetwork, 
  WhatsappLogo, 
  ArrowsOut,
  ArrowsIn
} from '@phosphor-icons/react';
import { DesignItem } from '../../types';
import { useFavorites } from '../../context/FavoritesContext';
import { getWhatsAppUrl, getDesignInquiryMessage } from '../../utils/whatsapp';
import { ShareModal } from './ShareModal';

interface FullscreenViewerProps {
  isOpen: boolean;
  onClose: () => void;
  design: DesignItem | null;
  onSelectDesign?: (design: DesignItem) => void;
  allDesigns?: DesignItem[];
}

export const FullscreenViewer: React.FC<FullscreenViewerProps> = ({
  isOpen,
  onClose,
  design,
  onSelectDesign,
  allDesigns = [],
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();

  const touchStartX = React.useRef<number>(0);
  const touchStartY = React.useRef<number>(0);
  const touchEndX = React.useRef<number>(0);
  const touchEndY = React.useRef<number>(0);
  const isDragging = React.useRef<boolean>(false);

  useEffect(() => {
    setActiveImageIndex(0);
    setZoomLevel(1);
  }, [design]);

  const images = design
    ? (design.galleryImages && design.galleryImages.length > 0 ? design.galleryImages : [design.mainImage])
    : [];

  const currentDesignIndex = design && allDesigns.length > 0
    ? allDesigns.findIndex(d => d.id === design.id)
    : -1;

  const handleNextDesign = useCallback(() => {
    if (!design || allDesigns.length === 0 || !onSelectDesign) return;
    const currentIndex = allDesigns.findIndex(d => d.id === design.id);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % allDesigns.length;
      onSelectDesign(allDesigns[nextIndex]);
      setActiveImageIndex(0);
      setZoomLevel(1);
    }
  }, [design, allDesigns, onSelectDesign]);

  const handlePrevDesign = useCallback(() => {
    if (!design || allDesigns.length === 0 || !onSelectDesign) return;
    const currentIndex = allDesigns.findIndex(d => d.id === design.id);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + allDesigns.length) % allDesigns.length;
      onSelectDesign(allDesigns[prevIndex]);
      setActiveImageIndex(0);
      setZoomLevel(1);
    }
  }, [design, allDesigns, onSelectDesign]);

  // Unified Next: Next Image or Next Design
  const handleNext = useCallback(() => {
    if (images.length > 1 && activeImageIndex < images.length - 1) {
      setActiveImageIndex(prev => prev + 1);
      setZoomLevel(1);
    } else if (allDesigns.length > 1 && onSelectDesign) {
      handleNextDesign();
    } else if (images.length > 1) {
      setActiveImageIndex(0);
      setZoomLevel(1);
    }
  }, [images.length, activeImageIndex, allDesigns.length, onSelectDesign, handleNextDesign]);

  // Unified Prev: Prev Image or Prev Design
  const handlePrev = useCallback(() => {
    if (images.length > 1 && activeImageIndex > 0) {
      setActiveImageIndex(prev => prev - 1);
      setZoomLevel(1);
    } else if (allDesigns.length > 1 && onSelectDesign) {
      handlePrevDesign();
    } else if (images.length > 1) {
      setActiveImageIndex(images.length - 1);
      setZoomLevel(1);
    }
  }, [images.length, activeImageIndex, allDesigns.length, onSelectDesign, handlePrevDesign]);

  // Touch Swipe Handlers (Mobile & Tablet)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel > 1) return; // Allow pan when zoomed
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (zoomLevel > 1) return;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (zoomLevel > 1) return;
    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = touchStartY.current - touchEndY.current;
    const minDistance = 45;

    // Must be predominantly horizontal gesture
    if (Math.abs(deltaX) > minDistance && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX > 0) {
        // Swiped Left (in RTL Arabic / standard -> Next)
        handleNext();
      } else {
        // Swiped Right -> Prev
        handlePrev();
      }
    }
  };

  // Mouse Drag Handlers (Desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) return;
    isDragging.current = true;
    touchStartX.current = e.clientX;
    touchEndX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || zoomLevel > 1) return;
    touchEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDragging.current || zoomLevel > 1) return;
    isDragging.current = false;
    const deltaX = touchStartX.current - touchEndX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handleNext();
      } else if (e.key === 'ArrowRight') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  const toggleBrowserFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => {});
        setIsFullscreen(true);
      } else {
        document.exitFullscreen?.().catch(() => {});
        setIsFullscreen(false);
      }
    } catch {
      // Fallback
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.4, 2.8));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.4, 1));
  const handleZoomReset = () => setZoomLevel(1);

  if (!isOpen || !design) return null;

  const isFav = isFavorite(design.id);
  const whatsAppUrl = getWhatsAppUrl(getDesignInquiryMessage(design));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-brand-dark/95 backdrop-blur-xl text-brand-ivory select-none overflow-hidden animate-fade-in">
      {/* Top Control Bar */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-brand-gold/15 bg-brand-dark/80 backdrop-blur-md">
        {/* Design Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-surface border border-brand-gold/30 text-brand-gold shrink-0">
            {design.categoryArabic}
          </span>
          <h3 className="text-xs sm:text-sm font-bold text-brand-ivory truncate max-w-xs sm:max-w-md">
            {design.title}
          </h3>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Zoom controls */}
          <div className="hidden md:flex items-center bg-brand-surface/60 rounded-xl p-1 border border-brand-gold/20 mr-2">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg hover:text-brand-gold hover:bg-brand-surface transition-colors"
              title="تكبير الصورة"
              aria-label="تكبير"
            >
              <MagnifyingGlassPlus size={16} />
            </button>
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="p-1.5 rounded-lg hover:text-brand-gold hover:bg-brand-surface transition-colors disabled:opacity-30"
              title="تصغير الصورة"
              aria-label="تصغير"
            >
              <MagnifyingGlassMinus size={16} />
            </button>
            <button
              onClick={handleZoomReset}
              disabled={zoomLevel === 1}
              className="p-1.5 rounded-lg hover:text-brand-gold hover:bg-brand-surface transition-colors disabled:opacity-30"
              title="إعادة ضبط الحجم"
              aria-label="إعادة ضبط"
            >
              <ArrowCounterClockwise size={16} />
            </button>
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleBrowserFullscreen}
            className="hidden sm:flex p-2 rounded-xl text-brand-ivory/80 hover:text-brand-gold hover:bg-brand-surface/80 border border-brand-gold/15 transition-all"
            title="ملء الشاشة"
            aria-label="ملء الشاشة"
          >
            {isFullscreen ? <ArrowsIn size={16} /> : <ArrowsOut size={16} />}
          </button>

          {/* Favorite toggle */}
          <button
            onClick={() => toggleFavorite(design.id)}
            className={`p-2 rounded-xl border transition-all ${
              isFav
                ? 'bg-brand-gold/20 border-brand-gold text-brand-gold'
                : 'text-brand-ivory/80 hover:text-brand-gold hover:bg-brand-surface/80 border-brand-gold/15'
            }`}
            title={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            aria-label="المفضلة"
          >
            <Heart size={16} weight={isFav ? "fill" : "regular"} className={isFav ? 'text-brand-gold' : ''} />
          </button>

          {/* Share button */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="p-2 rounded-xl text-brand-ivory/80 hover:text-brand-gold hover:bg-brand-surface/80 border border-brand-gold/15 transition-all"
            title="مشاركة التصميم"
            aria-label="مشاركة"
          >
            <ShareNetwork size={16} />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-brand-surface/80 text-brand-ivory hover:text-brand-gold hover:bg-brand-surface border border-brand-gold/30 transition-all mr-1"
            aria-label="إغلاق العارض"
            title="إغلاق (Esc)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Stage Image Area with Swipe & Navigation */}
      <div 
        className="relative flex-1 flex items-center justify-center p-2 sm:p-5 overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          className="relative max-w-full max-h-full flex items-center justify-center overflow-auto transition-opacity duration-300 select-none"
        >
          <img
            src={images[activeImageIndex] || design.mainImage}
            alt={design.title}
            draggable={false}
            style={{
              transform: `scale(${zoomLevel})`,
              transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: zoomLevel > 1 ? 'grab' : 'zoom-in',
            }}
            onClick={() => (zoomLevel === 1 ? handleZoomIn() : handleZoomReset())}
            className="max-h-[66vh] sm:max-h-[74vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-brand-gold/20 select-none pointer-events-auto"
          />
        </div>

        {/* Global Navigation Arrows (Right: Previous, Left: Next in RTL) */}
        {(images.length > 1 || allDesigns.length > 1) && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-brand-dark/90 hover:bg-brand-gold hover:text-brand-dark border border-brand-gold/40 text-brand-ivory transition-all backdrop-blur-md shadow-2xl flex items-center justify-center z-30 group"
              aria-label="السابق (تحريك لليمين)"
              title="السابق (سهم يمين)"
            >
              <CaretRight size={24} weight="bold" className="group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-brand-dark/90 hover:bg-brand-gold hover:text-brand-dark border border-brand-gold/40 text-brand-ivory transition-all backdrop-blur-md shadow-2xl flex items-center justify-center z-30 group"
              aria-label="التالي (تحريك لليسار)"
              title="التالي (سهم يسار)"
            >
              <CaretLeft size={24} weight="bold" className="group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}

        {/* Floating Counter & Swipe Hint */}
        <div className="absolute top-4 inset-x-0 flex flex-col items-center justify-center pointer-events-none z-20 gap-1.5">
          {allDesigns.length > 0 && currentDesignIndex !== -1 && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-dark/85 backdrop-blur-md text-brand-champagne border border-brand-gold/30 shadow-lg">
              تصميم {currentDesignIndex + 1} من {allDesigns.length}
              {images.length > 1 && ` • صورة ${activeImageIndex + 1} من ${images.length}`}
            </span>
          )}
          <span className="sm:hidden px-2.5 py-0.5 rounded-full text-[10px] text-brand-ivory/60 bg-black/40 backdrop-blur-sm border border-brand-gold/10">
            اسحب لليمين أو اليسار للتنقل
          </span>
        </div>
      </div>

      {/* Bottom Bar: Large WhatsApp CTA Button & Short Info */}
      <div className="relative z-20 border-t border-brand-gold/15 bg-brand-dark/95 backdrop-blur-md p-3 sm:p-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Short Project Info & Thumbnails */}
          <div className="flex items-center gap-3 overflow-x-auto max-w-full">
            {images.length > 1 && (
              <div className="flex items-center gap-1.5 shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      setZoomLevel(1);
                    }}
                    className={`relative w-11 h-11 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
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

            <div className="text-xs text-brand-ivory/70 hidden md:flex items-center gap-2">
              <span>المساحة: {design.approximateArea}</span>
              <span>•</span>
              <span>المواد: {design.materials.slice(0, 2).join('، ')}</span>
            </div>
          </div>

          {/* Prominent WhatsApp CTA Button */}
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-xs sm:text-sm font-extrabold bg-[#25D366] text-white shadow-luxury hover:bg-[#20bd5a] hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <WhatsappLogo size={18} weight="fill" />
            <span>اطلب هذا التصميم عبر واتساب</span>
          </a>

        </div>
      </div>

      {/* Share Dialog */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        design={design}
      />
    </div>
  );
};
