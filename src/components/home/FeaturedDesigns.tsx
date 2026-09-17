import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminDesigns, useSiteSettings } from '../../hooks/useAdminStore';
import { DesignCard } from '../gallery/DesignCard';
import { DesignItem } from '../../types';
import { ArrowLeft, Sparkle } from '@phosphor-icons/react';

interface FeaturedDesignsProps {
  onQuickView: (design: DesignItem) => void;
}

export const FeaturedDesigns: React.FC<FeaturedDesignsProps> = ({ onQuickView }) => {
  const designsData = useAdminDesigns();
  const settings = useSiteSettings();

  // Curate designs according to admin settings
  let featured: DesignItem[] = [];
  if (settings.homepageDesignIds && settings.homepageDesignIds.length > 0) {
    featured = settings.homepageDesignIds
      .map(id => designsData.find(d => d.id === id))
      .filter((d): d is DesignItem => Boolean(d));
  } else {
    featured = designsData.filter(d => d.isFeatured);
  }

  // If still empty (e.g. all deleted/unselected), fallback to top 6 designs
  if (featured.length === 0 && designsData.length > 0) {
    featured = designsData.slice(0, 6);
  }

  return (
    <section className="py-16 sm:py-24 bg-brand-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Clean & Minimal) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-brand-gold/15">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
              <Sparkle size={14} weight="fill" />
              <span>معرض أعمالنا الواقعية</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-ivory tracking-tight font-arabic">
              أحدث مشاريع <span className="text-gold-gradient">المطابخ وغرف النوم والديكور</span>
            </h2>
          </div>

          <Link
            to="/designs"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-gold hover:text-brand-champagne transition-colors self-start sm:self-auto group"
          >
            <span>عرض كل المشاريع ({designsData.length})</span>
            <ArrowLeft size={16} weight="bold" className="transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* Realistic Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(design => (
            <DesignCard
              key={design.id}
              design={design}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            to="/designs"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-surface border border-brand-gold/30 hover:border-brand-gold text-brand-ivory hover:text-brand-champagne shadow-luxury transition-all hover:scale-[1.01]"
          >
            <span>تصفح كامل المعرض ({designsData.length} تصميم)</span>
            <ArrowLeft size={14} weight="bold" />
          </Link>
        </div>

      </div>
    </section>
  );
};
