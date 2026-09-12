import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useBeforeAfter } from '../../hooks/useAdminStore';
import { ArrowsHorizontal, MapPin, Clock } from '@phosphor-icons/react';

export const BeforeAfter: React.FC = () => {
  const beforeAfterData = useBeforeAfter();
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const safeIndex = activeItemIndex < (beforeAfterData?.length || 0) ? activeItemIndex : 0;
  const currentItem = beforeAfterData?.[safeIndex];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  if (!currentItem) return null;

  return (
    <section className="py-20 lg:py-28 bg-brand-surface/20 border-t border-brand-gold/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-ivory tracking-tight font-arabic">
            قبل و بعد <span className="text-gold-gradient">التنفيذ</span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-ivory/70 mt-2">
            اسحب المؤشر لترى كيف نحوّل المساحات القديمة إلى تحف فنية متكاملة
          </p>
        </div>

        {/* Project Selector Tabs */}
        {beforeAfterData && beforeAfterData.length > 1 && (
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap max-w-3xl mx-auto">
            {beforeAfterData.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItemIndex(idx);
                  setSliderPosition(50);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  safeIndex === idx
                    ? 'bg-brand-gold text-brand-dark shadow-md shadow-brand-gold/20'
                    : 'bg-brand-surface/60 border border-brand-gold/20 text-brand-ivory/70 hover:text-brand-ivory hover:border-brand-gold/40'
                }`}
              >
                {item.titleArabic}
              </button>
            ))}
          </div>
        )}

        {/* Draggable Comparison Stage - Clean & Boxless */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            className="relative h-[340px] sm:h-[460px] md:h-[500px] rounded-3xl overflow-hidden select-none cursor-ew-resize shadow-2xl"
          >
            {/* After Image */}
            <img
              src={currentItem.afterImage}
              alt="بعد التنفيذ"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* After Floating Text (No box, no border) */}
            <span className="absolute top-5 left-5 z-10 text-brand-gold font-extrabold text-sm sm:text-base tracking-wide drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)]">
              بعد التنفيذ
            </span>

            {/* Before Image */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none transition-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={currentItem.beforeImage}
                alt="قبل التنفيذ"
                className="absolute inset-y-0 left-0 h-full object-cover max-w-none pointer-events-none"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                }}
              />
              <div className="absolute inset-0 bg-brand-dark/15" />
            </div>

            {/* Before Floating Text (No box, no border) */}
            <span className="absolute top-5 right-5 z-10 text-white font-extrabold text-sm sm:text-base tracking-wide drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)]">
              قبل التجديد
            </span>

            {/* Divider Line & Handle */}
            <div
              className="absolute inset-y-0 z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute inset-y-0 -left-[1.5px] w-[3px] bg-gradient-to-b from-brand-gold via-white to-brand-gold shadow-[0_0_12px_rgba(223,202,167,0.8)]" />

              <div className="absolute top-1/2 -translate-y-1/2 -left-5 w-10 h-10 rounded-full bg-brand-dark/95 border-2 border-brand-gold text-brand-gold flex items-center justify-center shadow-2xl backdrop-blur-md pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
                <ArrowsHorizontal size={18} weight="bold" />
              </div>
            </div>
          </div>

          {/* Project Details Below (Clean text, no box frame) */}
          <div className="mt-4 px-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-brand-ivory">
            <div className="space-y-0.5">
              <h3 className="text-sm sm:text-base font-bold text-brand-gold">{currentItem.titleArabic}</h3>
              <p className="text-xs text-brand-ivory/70 leading-relaxed max-w-xl font-light">{currentItem.description}</p>
            </div>

            <div className="flex items-center gap-4 shrink-0 text-xs text-brand-champagne/80">
              <div className="flex items-center gap-1.5">
                <MapPin size={15} weight="duotone" className="text-brand-gold" />
                <span>{currentItem.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={15} weight="duotone" className="text-brand-gold" />
                <span>المدة: {currentItem.duration}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
