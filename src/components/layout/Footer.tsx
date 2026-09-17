import React from 'react';
import { Link } from 'react-router-dom';
import { WhatsappLogo, Phone, MapPin, ArrowUp, LockKey } from '@phosphor-icons/react';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import { useSiteSettings } from '../../hooks/useAdminStore';
import logoImg from '../../assets/logo.png';

export const Footer: React.FC = () => {
  const settings = useSiteSettings();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const facebookUrl = settings.facebookUrl;
  const tiktokUrl = settings.tiktokUrl;


  return (
    <footer className="bg-brand-dark border-t border-brand-gold/20 pt-16 pb-10 text-brand-ivory relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-surface/30 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-brand-gold/15">
          
          {/* Column 1 & 2: Brand & About */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3.5 group">
              <div className="relative flex items-center justify-center shrink-0 py-1">
                <img
                  src={logoImg}
                  alt="شركة المجد للمطابخ الحديثة و PVC"
                  className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                {/* Subtle gold beam beneath logo on hover */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4/5 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/80 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[1px] pointer-events-none" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full h-4 bg-brand-gold/25 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-brand-ivory tracking-wide font-arabic">المجد</span>
                  <span className="text-sm font-light text-brand-gold font-serif tracking-widest">AL MĀGD</span>
                </div>
                <p className="text-xs text-brand-champagne font-medium tracking-wide">
                  Modern Kitchens & P V C
                </p>
              </div>
            </Link>

            <p className="text-sm text-brand-ivory/70 leading-relaxed max-w-md">
              شركة المجد لصناعة وأعمال المطابخ العصرية والأبواب والنوافذ والديكورات الداخلية (PVC | MDF). نصمم المساحات التي تلبي طموحك في مدينة البيضاء وكافة المدن الليبية بأعلى معايير الإتقان.
            </p>

            {/* Direct WhatsApp Badge */}
            <a
              href={getWhatsAppUrl('السلام عليكم، أود التواصل مع شركة المجد للمطابخ الحديثة و PVC.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-brand-surface/80 border border-brand-gold/30 hover:border-brand-gold text-brand-ivory hover:text-brand-champagne transition-all text-xs font-semibold shadow-inner-luxury group"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>تواصل مباشر واستشارة عبر واتساب</span>
              <WhatsappLogo size={16} weight="fill" className="text-emerald-400 group-hover:scale-110 transition-transform" />
            </a>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-brand-gold tracking-wider uppercase font-arabic">
              روابط سريعة
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-brand-ivory/70 hover:text-brand-champagne transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/designs" className="text-brand-ivory/70 hover:text-brand-champagne transition-colors">
                  معرض التصاميم
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-brand-ivory/70 hover:text-brand-champagne transition-colors">
                  خدماتنا المتكاملة
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-brand-ivory/70 hover:text-brand-champagne transition-colors">
                  تصاميمي المفضلة
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-brand-ivory/70 hover:text-brand-champagne transition-colors">
                  عن شركة المجد
                </Link>
              </li>
              <li>
                <Link to="/request" className="text-brand-gold hover:text-brand-champagne font-medium transition-colors">
                  اطلب تصميمك الآن
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-brand-gold tracking-wider uppercase font-arabic">
              أقسام التصاميم
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/designs?category=kitchens" className="text-brand-ivory/70 hover:text-brand-champagne transition-colors">
                  مطابخ عصرية
                </Link>
              </li>
              <li>
                <Link to="/designs?category=bedrooms" className="text-brand-ivory/70 hover:text-brand-champagne transition-colors">
                  غرف نوم فاخرة
                </Link>
              </li>
              <li>
                <Link to="/designs?category=living-rooms" className="text-brand-ivory/70 hover:text-brand-champagne transition-colors">
                  غرف معيشة ومجالس
                </Link>
              </li>
              <li>
                <Link to="/designs?category=wardrobes" className="text-brand-ivory/70 hover:text-brand-champagne transition-colors">
                  خزائن ودولاب ملابس
                </Link>
              </li>
              <li>
                <Link to="/designs?category=interior-design" className="text-brand-ivory/70 hover:text-brand-champagne transition-colors">
                  ديكور وتصميم صالات
                </Link>
              </li>
              <li>
                <Link to="/designs?category=pvc-doors" className="text-brand-ivory/70 hover:text-brand-champagne transition-colors">
                  أبواب وأعمال PVC
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-brand-gold tracking-wider uppercase font-arabic">
              تواصل معنا
            </h4>
            <ul className="space-y-3 text-sm text-brand-ivory/70">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} weight="duotone" className="text-brand-gold shrink-0 mt-0.5" />
                <span>{settings.address || 'ليبيا - البيضاء، شارع القهاوي (بالقرب من قرطاسية بغداد)'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={16} weight="duotone" className="text-brand-gold shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs text-brand-ivory/90 font-mono" dir="ltr">
                  <div>{settings.phone}</div>
                  <div>092 3741578</div>
                  <div>091 3769091</div>
                </div>
              </li>

            </ul>

            {/* Social Links */}
            <div className="pt-2">
              <p className="text-xs text-brand-gold/80 mb-2">تابعنا على منصاتنا الرسمية:</p>
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2">
                {/* TikTok Link to Official Page */}
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-black/70 border border-brand-gold/30 text-brand-ivory hover:text-brand-champagne hover:border-brand-gold text-xs font-bold transition-all shadow-sm group"
                  aria-label="صفحة شركة المجد على تيك توك"
                >
                  <svg className="w-4 h-4 fill-current text-brand-gold group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                  <span>تيك توك (@almajdone)</span>
                </a>

                {/* Facebook Link to Official Page */}
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#1877F2]/20 border border-[#1877F2]/40 text-[#1877F2] hover:bg-[#1877F2]/30 text-xs font-bold transition-all shadow-sm"
                  aria-label="صفحة شركة المجد على فيسبوك"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>فيسبوك (13k+)</span>
                </a>

                {/* WhatsApp */}
                <a
                  href={getWhatsAppUrl('السلام عليكم شركة المجد')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-3 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center gap-1.5 text-[#25D366] hover:bg-[#25D366]/30 text-xs font-bold transition-all"
                  aria-label="واتساب"
                >
                  <WhatsappLogo size={18} weight="fill" />
                  <span>واتساب</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-ivory/50">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} شركة المجد للمطابخ الحديثة و P V C - البيضاء، ليبيا. جميع الحقوق محفوظة.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-brand-champagne/70">نصمم المساحات التي تشبهك</span>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-brand-ivory/30 hover:text-brand-gold transition-colors text-[11px]"
              title="لوحة الإدارة"
            >
              <LockKey size={13} weight="duotone" />
              <span>لوحة الإدارة</span>
            </Link>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-brand-gold hover:text-brand-champagne transition-colors"
              aria-label="العودة لأعلى الصفحة"
            >
              <span>للأعلى</span>
              <ArrowUp size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
