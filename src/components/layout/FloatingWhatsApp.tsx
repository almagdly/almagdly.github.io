import React from 'react';
import { WhatsappLogo } from '@phosphor-icons/react';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import { useSiteSettings } from '../../hooks/useAdminStore';

export const FloatingWhatsApp: React.FC = () => {
  const settings = useSiteSettings();
  const whatsAppUrl = getWhatsAppUrl('السلام عليكم شركة المجد، أود الاستفسار عن تفصيل وتصميم مطبخ عصري أو ديكور داخلي.', settings.whatsapp);


  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center">
      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-[#25D366] text-white shadow-2xl hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all duration-300 border border-white/25"
        aria-label="تواصل عبر واتساب"
        title="تواصل عبر واتساب"
      >
        <WhatsappLogo size={24} weight="fill" className="text-white drop-shadow-sm shrink-0" />
        <span className="text-xs sm:text-sm font-extrabold tracking-wide whitespace-nowrap">
          تواصل عبر واتساب
        </span>
      </a>
    </div>
  );
};
