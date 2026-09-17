import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlass, X, ArrowLeft, Sparkle } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useAdminDesigns } from '../../hooks/useAdminStore';
import { DesignItem } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const designsData = useAdminDesigns();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DesignItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setResults([]);
      return;
    }

    const filtered = designsData.filter(d => {

      return (
        d.title.toLowerCase().includes(trimmed) ||
        (d.titleEn && d.titleEn.toLowerCase().includes(trimmed)) ||
        d.categoryArabic.toLowerCase().includes(trimmed) ||
        d.styleArabic.toLowerCase().includes(trimmed) ||
        d.colorsArabic.some(c => c.toLowerCase().includes(trimmed)) ||
        d.tags.some(t => t.toLowerCase().includes(trimmed)) ||
        d.description.toLowerCase().includes(trimmed)
      );
    });

    setResults(filtered);
  }, [query]);

  const quickKeywords = [
    { label: 'مطابخ بيج', query: 'بيج' },
    { label: 'مطابخ مودرن', query: 'مطابخ' },
    { label: 'غرف نوم فاخرة', query: 'غرف نوم' },
    { label: 'دريسنج روم', query: 'خزائن' },
    { label: 'تصاميم 3D', query: '3D' },
    { label: 'رخام طبيعي', query: 'رخام' },
  ];

  const handleSelectDesign = (slug: string) => {
    onClose();
    navigate(`/designs/${slug}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 sm:px-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-200"
      />

      {/* Modal Box */}
      <div
        className="relative w-full max-w-2xl bg-brand-dark/95 border border-brand-gold/30 rounded-2xl shadow-2xl overflow-hidden z-10 animate-fade-in"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-brand-gold/20 flex items-center gap-3 bg-brand-surface/60">
          <MagnifyingGlass size={20} weight="bold" className="text-brand-gold shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ابحث عن تصميم، لون، خامة، أو نوع المساحة..."
            className="w-full bg-transparent text-brand-ivory placeholder-brand-ivory/40 outline-none text-sm sm:text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-brand-ivory/50 hover:text-brand-ivory hover:bg-brand-surface"
            >
              <X size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-ivory/60 hover:text-brand-gold hover:bg-brand-surface transition-colors"
            aria-label="إغلاق"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Keyword Pills */}
        {!query && (
          <div className="p-5">
            <div className="flex items-center gap-1.5 mb-3 text-[11px] font-bold text-brand-gold uppercase tracking-wider">
              <Sparkle size={13} weight="fill" />
              <span>عمليات بحث شائعة</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickKeywords.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(item.query)}
                  className="px-3 py-1.5 rounded-xl text-xs bg-brand-surface/80 hover:bg-brand-gold hover:text-brand-dark text-brand-ivory/80 border border-brand-gold/20 transition-all"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {query && (
          <div className="max-h-[55vh] overflow-y-auto p-3 space-y-1.5">
            {results.length > 0 ? (
              results.map(design => (
                <div
                  key={design.id}
                  onClick={() => handleSelectDesign(design.slug)}
                  className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-brand-surface/80 border border-transparent hover:border-brand-gold/30 cursor-pointer transition-all group"
                >
                  <img
                    src={design.mainImage}
                    alt={design.title}
                    className="w-14 h-14 object-cover rounded-lg shrink-0 border border-brand-gold/20 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-brand-ivory truncate group-hover:text-brand-gold transition-colors">
                      {design.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-brand-ivory/60">
                      <span>{design.categoryArabic}</span>
                      <span>•</span>
                      <span>{design.styleArabic}</span>
                      <span>•</span>
                      <span className="text-brand-champagne">{design.approximateArea}</span>
                    </div>
                  </div>
                  <ArrowLeft size={14} weight="bold" className="text-brand-gold/60 group-hover:text-brand-gold -translate-x-1 group-hover:translate-x-0 transition-transform shrink-0" />
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-brand-ivory/50">
                <p className="text-xs">لم نتمكن من العثور على نتائج تطابق "{query}"</p>
                <p className="text-[11px] mt-1">جرب كلمات أخرى مثل: مطبخ، رخام، فاخر، رمادي</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-brand-dark/90 border-t border-brand-gold/10 flex items-center justify-between text-[11px] text-brand-ivory/50 px-4">
          <span>AL MĀGD Discovery</span>
          <span>اضغط للانتقال الفوري</span>
        </div>
      </div>
    </div>
  );
};
