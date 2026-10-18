import React from 'react';
import { servicesData } from '../data/servicesData';
import { CheckCircle, ArrowLeft, WhatsappLogo } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { getWhatsAppUrl, trackWhatsAppClick } from '../utils/whatsapp';

export const ServicesPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-ivory tracking-tight font-arabic">
            حلول متكاملة <span className="text-gold-gradient">للتصميم والتنفيذ</span>
          </h1>
          <p className="text-xs sm:text-sm text-brand-ivory/70 mt-3 leading-relaxed font-light">
            نقدم باقة شاملة من الخدمات الهندسية المتخصصة لتصميم وتصنيع المطابخ والديكورات الداخلية الفاخرة
          </p>
        </div>

        {/* Detailed Services Stack */}
        <div className="space-y-12">
          {servicesData.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={service.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-8 rounded-3xl bg-brand-surface/40 border border-brand-gold/20 shadow-luxury"
              >
                {/* Visual Image */}
                <div
                  className={`lg:col-span-6 relative rounded-2xl overflow-hidden border border-brand-gold/30 shadow-2xl aspect-[16/11] ${
                    isEven ? 'order-1 lg:order-1' : 'order-1 lg:order-2'
                  }`}
                >
                  <img
                    src={service.image}
                    alt={service.titleArabic}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />
                  
                  <span className="absolute top-3.5 right-3.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-brand-dark/80 text-brand-gold border border-brand-gold/30 backdrop-blur-md">
                    0{index + 1}
                  </span>
                </div>

                {/* Content & Features */}
                <div
                  className={`lg:col-span-6 space-y-5 ${
                    isEven ? 'order-2 lg:order-2' : 'order-2 lg:order-1'
                  }`}
                >
                  <div>
                    <span className="text-[11px] font-serif text-brand-champagne uppercase tracking-widest">
                      {service.titleEn}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-brand-ivory mt-0.5 font-arabic">
                      {service.titleArabic}
                    </h2>
                  </div>

                  <p className="text-xs sm:text-sm text-brand-ivory/80 leading-relaxed font-light">
                    {service.description}
                  </p>

                  {/* Feature Checkpoints */}
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-bold text-brand-gold">المميزات الرئيسية:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-brand-ivory/90">
                          <CheckCircle size={14} weight="fill" className="text-brand-gold shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-brand-gold/15">
                    <Link
                      to="/request"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-champagne to-brand-gold text-brand-dark font-bold text-xs shadow-luxury-gold hover:opacity-95 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <span>طلب الخدمة</span>
                      <ArrowLeft size={14} weight="bold" className="text-brand-dark" />
                    </Link>

                    <a
                      href={getWhatsAppUrl(`السلام عليكم، أود الاستفسار عن خدمة "${service.titleArabic}" لدى شركة المجد.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={trackWhatsAppClick}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <WhatsappLogo size={15} weight="fill" />
                      <span>استفسار واتساب</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
