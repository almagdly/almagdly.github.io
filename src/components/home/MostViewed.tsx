import React from 'react';
import { useAdminDesigns } from '../../hooks/useAdminStore';
import { DesignCard } from '../gallery/DesignCard';
import { DesignItem } from '../../types';
import { ArrowLeft } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

interface MostViewedProps {
  onQuickView: (design: DesignItem) => void;
}

export const MostViewed: React.FC<MostViewedProps> = ({ onQuickView }) => {
  const designsData = useAdminDesigns();
  // Sort by views descending or isMostViewed
  const mostViewed = [...designsData]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);


  return (
    <section className="py-20 lg:py-28 bg-brand-surface/20 border-t border-brand-gold/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-ivory tracking-tight">
              التصاميم <span className="text-gold-gradient">الأكثر مشاهدة</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-ivory/70 mt-2">
              نماذج ألهمت المئات من عملائنا ونالت أعلى نسب تفضيل واستفسار
            </p>
          </div>

          <Link
            to="/designs?sort=most-viewed"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold hover:text-brand-champagne transition-colors self-start md:self-auto group"
          >
            <span>استعراض الأكثر رواجاً</span>
            <ArrowLeft size={14} weight="bold" className="transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* 4 Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mostViewed.map(design => (
            <DesignCard
              key={design.id}
              design={design}
              onQuickView={onQuickView}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
