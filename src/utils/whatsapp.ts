import { DesignItem } from '../types';
import { adminStore } from '../services/adminStore';

export const OFFICIAL_WHATSAPP_NUMBER = '218945919679'; // Libyan international format without +

export const getWhatsAppUrl = (message: string, phone?: string): string => {
  const targetPhone = phone || adminStore.getSettings().whatsapp || OFFICIAL_WHATSAPP_NUMBER;
  const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export const trackWhatsAppClick = () => {
  try {
    adminStore.recordWhatsAppClick();
  } catch {}
};


export const getDesignInquiryMessage = (design: DesignItem): string => {
  const currentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/#/designs/${design.slug}`
    : `https://almagdly.github.io/#/designs/${design.slug}`;

  return `السلام عليكم شركة المجد،
أنا مهتم بتنفيذ تصميم "${design.title}" (${design.categoryArabic}) في مساحتي.
رابط التصميم: ${currentUrl}
أرجو التواصل لمناقشة التفاصيل وتحديد موعد أخذ المقاسات.`;
};

export const getSimilarDesignInquiryMessage = (design: DesignItem): string => {
  return `السلام عليكم شركة المجد،
أعجبني طراز تصميم "${design.title}" (${design.styleArabic}) وأود تصميم مساحة مشابهة له بمقاسات مخصصة لمنزلي في البيضاء/ليبيا.`;
};

export const getBatchFavoritesMessage = (designs: DesignItem[]): string => {
  const titles = designs.map((d, i) => `${i + 1}. ${d.title} (${d.categoryArabic})`).join('\n');
  return `السلام عليكم شركة المجد،
قمت باختيار وتفضيل هذه التصاميم من موقعكم وأود استشارتكم في إمكانية تنفيذها:

${titles}

يرجى تزويدي بالأسعار التقريبية وتفاصيل التنفيذ.`;
};

export const getProjectFormWhatsAppMessage = (formData: {
  name: string;
  phone: string;
  projectType: string;
  location: string;
  spaceSize?: string;
  preferredStyle?: string;
  budgetRange?: string;
  details?: string;
}): string => {
  return `طلب مشروع جديد عبر الموقع - شركة المجد:
-----------------------------------
الاسم: ${formData.name}
رقم الهاتف: ${formData.phone}
نوع المشروع: ${formData.projectType}
المدينة/الموقع: ${formData.location}
المساحة: ${formData.spaceSize || 'غير محدد'}
الأسلوب المفضل: ${formData.preferredStyle || 'حسب اقتراح المهندس'}
الميزانية المتوقعة: ${formData.budgetRange || 'غير محدد'}
ملاحظات: ${formData.details || 'لا يوجد'}`;
};
