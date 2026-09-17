import React from 'react';
import { DesignItem } from '../../types';
import { useAdminDesigns } from '../../hooks/useAdminStore';
import { DesignCard } from './DesignCard';
import { ArrowLeft } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

interface SimilarDesignsProps {
  currentDesign: DesignItem;
  onQuickView?: (design: DesignItem) => void;
}

export const SimilarDesigns: React.FC<SimilarDesignsProps> = ({
  currentDesign,
  onQuickView,
}) => {
  const designsData = useAdminDesigns();
  const similar = designsData
    .filter(d => d.id !== currentDesign.id)

    .map(d => {
      let score = 0;
      if (d.category === currentDesign.category) score += 5;
      if (d.style === currentDesign.style) score += 3;
      const sharedColors = d.colors.filter(c => currentDesign.colors.includes(c));
      score += sharedColors.length * 2;
      return { design: d, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(item => item.design);

  if (similar.length === 0) return null;

  return (
    <section className="pt-16 pb-8 border-t border-brand-gold/15">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-brand-ivory">
            تصاميم قد تعجبك
          </h2>
          <p className="text-xs sm:text-sm text-brand-ivory/60 mt-1">
            مساحات من نفس الطابع ({currentDesign.styleArabic}) والروح المعمارية
          </p>
        </div>

        <Link
          to={`/designs?category=${currentDesign.category}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold hover:text-brand-champagne transition-colors"
        >
          <span>استكشف المزيد في {currentDesign.categoryArabic}</span>
          <ArrowLeft size={13} weight="bold" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {similar.map(item => (
          <DesignCard
            key={item.id}
            design={item}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </section>
  );
};
