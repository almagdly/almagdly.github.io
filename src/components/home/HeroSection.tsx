import React from 'react';
import { Link } from 'react-router-dom';
import { WhatsappLogo, ArrowLeft, Sparkle } from '@phosphor-icons/react';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import { getProjectImage } from '../../utils/assetHelper';
import { useSiteSettings } from '../../hooks/useAdminStore';

export const HeroSection: React.FC = () => {
  const settings = useSiteSettings();
  const heroImage = settings.heroImage || getProjectImage('p1.jpg');
  const heroTagline = settings.heroTagline || 'شركة المجد للمطابخ الحديثة، غرف النوم، والديكورات الداخلية — البيضاء';
  const whatsAppUrl = getWhatsAppUrl('السلام عليكم شركة المجد، أود الاستفسار عن تفصيل وتصميم مساحتي (مطابخ / غرف نوم / خزائن / ديكورات).');

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-brand-dark">
      {/* Real Company Interior Background Photo */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="تصميم وتنفيذ شركة المجد للمطابخ وغرف النوم والديكورات الداخلية"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          loading="eager"
          fetchPriority="high"
          onError={e => {
            (e.target as HTMLImageElement).src = getProjectImage('p1.jpg');
          }}
        />
        {/* Dark Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/75 to-brand-dark/45" />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16 flex flex-col items-center">
        
        {/* Brand Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-dark/85 border border-brand-gold/30 text-brand-champagne text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-md shadow-luxury">
          <Sparkle size={14} weight="fill" className="text-brand-gold shrink-0 animate-pulse" />
          <span>{heroTagline}</span>
        </div>

        {/* Comprehensive Powerful Headline (Not just kitchens!) */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.2] font-arabic max-w-4xl">
          تصاميم راقية.<br className="hidden sm:inline" />
          <span className="text-gold-gradient">حلول داخلية متكاملة تليق بك.</span>
        </h1>

        {/* Subtitle Covering Full Spectrum */}
        <p className="text-xs sm:text-base md:text-lg text-brand-ivory/85 max-w-2xl mx-auto mt-5 font-light leading-relaxed">
          نصمم ونفصّل أرقى المطابخ العصرية، غرف النوم الفاخرة، خزائن الملابس والدريسنج روم، وتكسيات الديكور الداخلي وأعمال الـ PVC بأعلى معايير الجودة والإتقان.
        </p>

        {/* Service Quick Tags */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs text-brand-champagne/90">
          <span className="px-2.5 py-1 rounded-lg bg-brand-surface/70 border border-brand-gold/20">مطابخ مودرن</span>
          <span className="px-2.5 py-1 rounded-lg bg-brand-surface/70 border border-brand-gold/20">غرف نوم ماستر</span>
          <span className="px-2.5 py-1 rounded-lg bg-brand-surface/70 border border-brand-gold/20">خزائن ودريسنج روم</span>
          <span className="px-2.5 py-1 rounded-lg bg-brand-surface/70 border border-brand-gold/20">ديكور وصالات</span>
          <span className="px-2.5 py-1 rounded-lg bg-brand-surface/70 border border-brand-gold/20">أبواب PVC & MDF</span>
          <span className="px-2.5 py-1 rounded-lg bg-brand-surface/70 border border-brand-gold/20">تصميم 3D</span>
        </div>

        {/* Two Clear Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Primary View Designs Button */}
          <Link
            to="/designs"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-champagne to-brand-gold text-brand-dark font-extrabold text-sm sm:text-base shadow-luxury-gold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 whitespace-nowrap"
          >
            <span>استكشف جميع الأعمال والتصاميم</span>
            <ArrowLeft size={18} weight="bold" />
          </Link>

          {/* Prominent WhatsApp CTA */}
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#25D366] text-white font-extrabold text-sm sm:text-base shadow-luxury hover:bg-[#20bd5a] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 whitespace-nowrap"
          >
            <WhatsappLogo size={20} weight="fill" />
            <span>تواصل عبر واتساب</span>
          </a>
        </div>

      </div>

      {/* Subtle Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-brand-dark to-transparent pointer-events-none" />
    </section>
  );
};
