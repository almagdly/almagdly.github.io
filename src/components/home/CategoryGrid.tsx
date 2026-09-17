import React from 'react';
import { Link } from 'react-router-dom';
import { categoriesData } from '../../data/categoriesData';
import { useAdminDesigns } from '../../hooks/useAdminStore';
import { ArrowLeft } from '@phosphor-icons/react';

export const CategoryGrid: React.FC = () => {
  const designs = useAdminDesigns();

  return (
    <section className="py-16 sm:py-24 bg-brand-surface/20 border-y border-brand-gold/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-brand-gold/15">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-ivory tracking-tight font-arabic">
              أقسام <span className="text-gold-gradient">التصاميم</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-ivory/70 mt-1.5 font-light">
              تصفح تصاميمنا بحسب المساحة المطلوبة وشاهد أفكاراً جاهزة للتنفيذ
            </p>
          </div>

          <Link
            to="/designs"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-gold hover:text-brand-champagne transition-colors self-start sm:self-auto group"
          >
            <span>عرض كل الأقسام</span>
            <ArrowLeft size={16} weight="bold" className="transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* 6 Visual Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesData.map(category => {
            const actualCount = designs.filter(d => d.category === category.id).length;
            const displayCount = actualCount > 0 ? actualCount : category.count;

            return (
              <Link
                key={category.id}
                to={category.link || `/designs?category=${category.id}`}
                className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-brand-gold/20 hover:border-brand-gold/70 shadow-lg hover:shadow-2xl transition-all duration-400 flex flex-col justify-end p-5"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={category.image}
                    alt={category.nameArabic}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />
                </div>

                {/* Count Badge */}
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-dark/85 text-brand-champagne border border-brand-gold/30 backdrop-blur-sm">
                  {displayCount > 0 ? `${displayCount} تصميم` : 'قريباً • طلب كتالوج'}
                </div>


              {/* Card Content */}
              <div className="relative z-10 space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-brand-ivory group-hover:text-brand-gold transition-colors font-arabic">
                  {category.nameArabic}
                </h3>
                
                <p className="text-xs text-brand-ivory/70 line-clamp-1 font-light">
                  {category.description}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-brand-gold">
                  <span>{displayCount > 0 ? 'تصفح التصاميم' : 'طلب كتالوج عبر واتساب'}</span>
                  <div className="w-6 h-6 rounded-full bg-brand-surface/80 border border-brand-gold/30 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark transition-all">
                    <ArrowLeft size={12} weight="bold" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        </div>

      </div>
    </section>
  );
};
