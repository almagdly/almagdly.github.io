import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { getWhatsAppUrl, getBatchFavoritesMessage, trackWhatsAppClick } from '../utils/whatsapp';
import { 
  Heart, 
  Trash, 
  WhatsappLogo, 
  Sparkle, 
  CheckSquare, 
  Square
} from '@phosphor-icons/react';

export const FavoritesPage: React.FC = () => {
  const {
    favoriteItems,
    removeFromFavorites,
    clearFavorites,
    selectedIds,
    toggleSelect,
    selectAll,
    deselectAll,
    isAllSelected,
  } = useFavorites();

  const navigate = useNavigate();

  const itemsToSend = selectedIds.length > 0
    ? favoriteItems.filter(item => selectedIds.includes(item.id))
    : favoriteItems;

  const handleSendToWhatsApp = () => {
    trackWhatsAppClick();
    const message = getBatchFavoritesMessage(itemsToSend);
    window.open(getWhatsAppUrl(message), '_blank');
  };

  return (
    <div className="pt-28 pb-20 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-brand-gold/15 mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-ivory tracking-tight font-arabic">
              تصاميمي <span className="text-gold-gradient">المفضلة</span>
            </h1>
            <p className="text-xs sm:text-sm text-brand-ivory/70 mt-1.5">
              التصاميم التي نالت إعجابك. يمكنك اختيار مجموعة منها ومشاركتها مباشرة مع مهندسينا عبر واتساب
            </p>
          </div>

          {favoriteItems.length > 0 && (
            <button
              onClick={clearFavorites}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 self-start md:self-auto transition-colors"
            >
              <Trash size={14} />
              <span>إفراغ القائمة</span>
            </button>
          )}
        </div>

        {/* Content State */}
        {favoriteItems.length > 0 ? (
          <div className="space-y-8">
            
            {/* Batch Action Bar */}
            <div className="p-4 rounded-2xl bg-brand-surface/70 border border-brand-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-luxury backdrop-blur-md">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={isAllSelected ? deselectAll : selectAll}
                  className="flex items-center gap-2 text-xs font-semibold text-brand-ivory hover:text-brand-gold transition-colors"
                >
                  {isAllSelected ? (
                    <CheckSquare size={18} weight="fill" className="text-brand-gold" />
                  ) : (
                    <Square size={18} className="text-brand-ivory/60" />
                  )}
                  <span>{isAllSelected ? 'إلغاء تحديد الكل' : 'تحديد جميع التصاميم'}</span>
                </button>

                <span className="text-xs text-brand-champagne/80 border-r border-brand-gold/20 pr-3">
                  تم تحديد ({itemsToSend.length} من {favoriteItems.length})
                </span>
              </div>

              {/* Send to WhatsApp */}
              <button
                onClick={handleSendToWhatsApp}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-champagne to-brand-gold text-brand-dark font-extrabold text-xs sm:text-sm shadow-luxury-gold hover:opacity-95 transition-all whitespace-nowrap"
              >
                <WhatsappLogo size={16} weight="fill" className="text-brand-dark" />
                <span>إرسال اختياراتي عبر واتساب ({itemsToSend.length})</span>
              </button>
            </div>

            {/* Favorite Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {favoriteItems.map(design => {
                const isSelected = selectedIds.includes(design.id);
                return (
                  <div
                    key={design.id}
                    className={`group relative rounded-2xl overflow-hidden bg-brand-surface/50 border transition-all duration-300 flex flex-col shadow-lg ${
                      isSelected
                        ? 'border-brand-gold ring-1 ring-brand-gold shadow-luxury-gold'
                        : 'border-brand-gold/20 hover:border-brand-gold/50'
                    }`}
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/11] overflow-hidden bg-brand-dark/40">
                      <img
                        src={design.mainImage}
                        alt={design.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />

                      {/* Checkbox */}
                      <button
                        onClick={() => toggleSelect(design.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-xl bg-brand-dark/80 backdrop-blur-md border border-brand-gold/30 transition-transform active:scale-95 z-10"
                        title={isSelected ? 'إلغاء التحديد' : 'تحديد للمشاركة'}
                      >
                        {isSelected ? (
                          <CheckSquare size={18} weight="fill" className="text-brand-gold" />
                        ) : (
                          <Square size={18} className="text-brand-ivory/60" />
                        )}
                      </button>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromFavorites(design.id)}
                        className="absolute top-3 left-3 p-1.5 rounded-xl bg-brand-dark/80 text-red-400 hover:text-red-300 backdrop-blur-md border border-red-500/20 transition-all z-10"
                        title="إزالة من المفضلة"
                      >
                        <Trash size={16} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-brand-champagne/80 mb-1">
                          <span>{design.categoryArabic}</span>
                          <span>•</span>
                          <span>{design.styleArabic}</span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-brand-ivory truncate">
                          {design.title}
                        </h3>

                        <p className="text-xs text-brand-ivory/60 line-clamp-2 mt-1 leading-relaxed">
                          {design.description}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-brand-gold/10 flex items-center justify-between">
                        <button
                          onClick={() => navigate(`/designs/${design.slug}`)}
                          className="text-xs font-bold text-brand-gold hover:text-brand-champagne transition-colors"
                        >
                          عرض التفاصيل ←
                        </button>

                        <button
                          onClick={() => toggleSelect(design.id)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                            isSelected
                              ? 'bg-brand-gold/20 border-brand-gold text-brand-gold'
                              : 'bg-brand-dark/60 border-brand-gold/20 text-brand-ivory/70'
                          }`}
                        >
                          {isSelected ? 'محدد' : 'تحديد'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        ) : (
          /* Empty Screen */
          <div className="py-24 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-brand-surface border border-brand-gold/20 flex items-center justify-center text-brand-gold/40 mx-auto shadow-luxury">
              <Heart size={32} weight="duotone" />
            </div>

            <h3 className="text-lg font-bold text-brand-ivory">قائمة المفضلة فارغة حالياً</h3>
            <p className="text-xs text-brand-ivory/60 leading-relaxed font-light">
              أثناء تصفحك لمعرض التصاميم، اضغط على أيقونة القلب في أي تصميم ينال إعجابك لحفظه هنا والرجوع إليه بسهولة.
            </p>

            <Link
              to="/designs"
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs shadow-luxury-gold hover:bg-brand-champagne transition-all"
            >
              <Sparkle size={14} weight="fill" className="text-brand-dark" />
              <span>استكشف التصاميم وأضف مفضلاتك</span>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};
