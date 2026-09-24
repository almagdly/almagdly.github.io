import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Heart, Sparkle, WhatsappLogo, House, Image, SquaresFour, Info, PaperPlaneTilt } from '@phosphor-icons/react';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import logoImg from '../../assets/logo.png';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { name: string; path: string }[];
  favoriteCount: number;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navLinks,
  favoriteCount,
}) => {
  const location = useLocation();

  const getLinkIcon = (path: string) => {
    switch (path) {
      case '/': return <House size={20} />;
      case '/designs': return <Image size={20} />;
      case '/services': return <SquaresFour size={20} />;
      case '/about': return <Info size={20} />;
      case '/contact': return <PaperPlaneTilt size={20} />;
      default: return <House size={20} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer Content */}
      <div className="relative w-full max-w-xs h-full bg-brand-dark border-r border-brand-gold/20 shadow-2xl flex flex-col z-10 overflow-y-auto transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="p-4 border-b border-brand-gold/15 flex items-center justify-between bg-brand-surface/60">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center shrink-0">
              <img
                src={logoImg}
                alt="المجد"
                className="h-10 w-auto object-contain"
              />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4/5 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent rounded-full blur-[1px]" />
            </div>
            <div>
              <h3 className="font-extrabold text-brand-ivory text-base">المجد</h3>
              <p className="text-[10px] text-brand-gold font-serif">AL MĀGD</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-ivory/70 hover:text-brand-gold"
            aria-label="إغلاق القائمة"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <div className="p-4 flex-1 space-y-1">
          <p className="text-[10px] font-bold text-brand-gold/70 tracking-wider uppercase mb-2 px-3">
            التنقل
          </p>
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-surface text-brand-gold border border-brand-gold/30'
                    : 'text-brand-ivory/80 hover:bg-brand-surface/40 hover:text-brand-champagne'
                }`}
              >
                <span className={isActive ? 'text-brand-gold' : 'text-brand-ivory/50'}>
                  {getLinkIcon(link.path)}
                </span>
                <span>{link.name}</span>
              </Link>
            );
          })}

          {/* Favorites */}
          <Link
            to="/favorites"
            onClick={onClose}
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              location.pathname === '/favorites'
                ? 'bg-brand-surface text-brand-gold border border-brand-gold/30'
                : 'text-brand-ivory/80 hover:bg-brand-surface/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart size={20} weight={favoriteCount > 0 ? "fill" : "regular"} className={favoriteCount > 0 ? 'text-brand-gold' : 'text-brand-ivory/50'} />
              <span>المفضلة</span>
            </div>
            {favoriteCount > 0 && (
              <span className="bg-brand-gold text-brand-dark text-[10px] font-bold px-2 py-0.5 rounded-full">
                {favoriteCount}
              </span>
            )}
          </Link>

          {/* Admin Link */}
          <Link
            to="/admin"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              location.pathname === '/admin'
                ? 'bg-brand-surface text-brand-gold border border-brand-gold/30'
                : 'text-brand-ivory/50 hover:bg-brand-surface/40 hover:text-brand-gold'
            }`}
          >
            <SquaresFour size={20} className="text-brand-gold/70" />
            <span>لوحة الإدارة</span>
          </Link>
        </div>

        {/* Bottom CTAs */}
        <div className="p-4 border-t border-brand-gold/15 space-y-2.5 bg-brand-surface/40">
          <Link
            to="/request"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-gold via-brand-champagne to-brand-gold text-brand-dark shadow-luxury-gold hover:opacity-95 transition-all"
          >
            <Sparkle size={14} weight="fill" className="text-brand-dark" />
            <span>ابدأ مشروعك</span>
          </Link>

          <a
            href={getWhatsAppUrl('السلام عليكم، أود التواصل مع فريق شركة المجد للاستفسار عن التصاميم.')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 transition-all"
          >
            <WhatsappLogo size={16} weight="fill" />
            <span>محادثة واتساب مباشرة</span>
          </a>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href="https://tiktok.com/@almajdone?_r=1&_t=ZS-99ataXUqlyk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-black/60 border border-brand-gold/30 text-brand-ivory hover:text-brand-gold text-[11px] font-bold transition-all"
            >
              <svg className="w-3.5 h-3.5 fill-current text-brand-gold" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
              <span>تيك توك</span>
            </a>

            <a
              href="https://www.facebook.com/p/%D8%B4%D8%B1%D9%83%D8%A9-%D8%A7%D9%84%D9%85%D8%AC%D8%AF-%D9%84%D9%84%D9%85%D8%B7%D8%A7%D8%A8%D8%AE-%D8%A7%D9%84%D8%AD%D8%AF%D9%8A%D8%AB%D8%A9-%D9%88-P-V-C-100041790767867/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#1877F2]/20 border border-[#1877F2]/40 text-[#1877F2] text-[11px] font-bold transition-all"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>فيسبوك</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
