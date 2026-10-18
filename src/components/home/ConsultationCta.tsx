import React from 'react';
import { Link } from 'react-router-dom';
import { WhatsappLogo, ArrowLeft, PhoneCall, Sparkle } from '@phosphor-icons/react';
import { getWhatsAppUrl, trackWhatsAppClick } from '../../utils/whatsapp';

export const ConsultationCta: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-t from-brand-dark via-brand-surface/40 to-brand-dark border-t border-brand-gold/20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-brand-ivory tracking-tight leading-tight font-arabic max-w-2xl mx-auto">
          هل أنت مستعد لتصميم مساحة <span className="text-gold-gradient">تشبهك تماماً؟</span>
        </h2>

        <p className="mt-4 text-xs sm:text-base text-brand-ivory/80 max-w-xl mx-auto leading-relaxed font-light">
          احجز موعد استشارة مع نخبة من مهندسي الديكور والمطابخ في شركة المجد، واستلم تصميماً ثلاثي الأبعاد يعكس ذوقك الرفيع.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/request"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-brand-gold via-brand-champagne to-brand-gold text-brand-dark shadow-luxury-gold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>ابدأ طلب مشروعك الآن</span>
            <ArrowLeft size={16} weight="bold" className="text-brand-dark" />
          </Link>

          <a
            href={getWhatsAppUrl('السلام عليكم، أود حجز موعد استشارة تصميم داخلي ومطابخ لدى شركة المجد.')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackWhatsAppClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <WhatsappLogo size={18} weight="fill" />
            <span>تواصل مباشرة عبر واتساب</span>
          </a>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-brand-ivory/60">
          <span className="flex items-center gap-1.5">
            <Sparkle size={13} weight="fill" className="text-brand-gold" />
            <span>استشارة مبدئية مجانية</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <PhoneCall size={13} weight="duotone" className="text-brand-gold" />
            <span>رد سريع خلال ساعات العمل</span>
          </span>
        </div>

      </div>
    </section>
  );
};
