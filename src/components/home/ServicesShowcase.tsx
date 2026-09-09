import React from 'react';
import { Link } from 'react-router-dom';
import { servicesData } from '../../data/servicesData';
import { ArrowLeft, CookingPot, Bed, CoatHanger, HouseLine, Cube, Sparkle, Door, WhatsappLogo } from '@phosphor-icons/react';
import { getWhatsAppUrl } from '../../utils/whatsapp';

export const ServicesShowcase: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CookingPot': return <CookingPot size={22} weight="duotone" />;
      case 'Bed': return <Bed size={22} weight="duotone" />;
      case 'CoatHanger': return <CoatHanger size={22} weight="duotone" />;
      case 'HouseLine': return <HouseLine size={22} weight="duotone" />;
      case 'Cube': return <Cube size={22} weight="duotone" />;
      case 'Door': return <Door size={22} weight="duotone" />;
      case 'Sparkle': return <Sparkle size={22} weight="duotone" />;
      default: return <Sparkle size={22} weight="duotone" />;
    }
  };

  const getServiceWhatsAppUrl = (service: typeof servicesData[0]) => {
    const msg = `السلام عليكم شركة المجد،
أود الاستفسار وطلب حجز موعد لأخذ القياسات والمعاينة الميدانية بخصوص:
*${service.titleArabic}*
الموقع: مدينة البيضاء وضواحيها.
يرجى التواصل لتحديد الموعد ومناقشة تفاصيل وتكلفة التنفيذ.`;
    return getWhatsAppUrl(msg);
  };

  const getCategoryLink = (serviceId: string) => {
    switch (serviceId) {
      case 'kitchen-design': return '/designs?category=kitchens';
      case 'bedroom-design': return '/designs?category=bedrooms';
      case 'wardrobes': return '/designs?category=wardrobes';
      case 'interior-design': return '/designs?category=interior-design';
      case 'pvc-doors': return '/designs?category=pvc-doors';
      case '3d-design': return '/request';
      default: return '/designs';
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-brand-dark border-t border-brand-gold/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-ivory tracking-tight font-arabic">
            خدماتنا <span className="text-gold-gradient">المتخصصة</span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-ivory/70 mt-2 font-light">
            حلول متكاملة في التصميم الداخلي والتصنيع بأعلى معايير الإتقان في مدينة البيضاء
          </p>
        </div>

        {/* 6 Clean Visual Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map(service => (
            <div
              key={service.id}
              className="group rounded-2xl overflow-hidden bg-brand-surface/30 border border-brand-gold/20 hover:border-brand-gold/60 transition-all duration-400 flex flex-col justify-between shadow-lg hover:shadow-2xl"
            >
              {/* Service Visual Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.titleArabic}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = './projects/dr1.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/30 to-transparent" />
                
                <div className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-brand-dark/80 backdrop-blur-md text-brand-gold border border-brand-gold/30 flex items-center justify-center shadow-md">
                  {getIcon(service.icon)}
                </div>

                <div className="absolute top-3 left-3 text-[10px] text-brand-champagne/80 font-serif px-2.5 py-1 rounded-lg bg-brand-dark/70 backdrop-blur-sm border border-brand-gold/10">
                  {service.titleEn}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-brand-ivory group-hover:text-brand-gold transition-colors">
                    {service.titleArabic}
                  </h3>
                  
                  <p className="text-xs text-brand-ivory/70 mt-2 leading-relaxed font-light">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {service.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-brand-gold/10 text-brand-champagne/90 border border-brand-gold/15"
                      >
                        • {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Actions: WhatsApp Measurement Booking & Gallery Link */}
                <div className="pt-3 border-t border-brand-gold/10 flex items-center justify-between gap-2">
                  <a
                    href={getServiceWhatsAppUrl(service)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-brand-dark border border-[#25D366]/30 hover:border-[#25D366] text-xs font-bold transition-all duration-300 shadow-sm"
                  >
                    <WhatsappLogo size={16} weight="fill" />
                    <span>حجز موعد أخذ المقاسات</span>
                  </a>

                  <Link
                    to={getCategoryLink(service.id)}
                    className="text-xs font-semibold text-brand-gold hover:text-brand-champagne flex items-center gap-1 transition-colors"
                  >
                    <span>استعراض النماذج</span>
                    <ArrowLeft size={12} weight="bold" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
