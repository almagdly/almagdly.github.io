import React, { useState, useMemo } from 'react';
import {
  PlusCircle,
  MagnifyingGlass,
  Funnel,
  PencilSimple,
  Trash,
  Star,
  ArrowSquareOut,
  CaretLeft,
  CaretRight,
  ArrowsDownUp,
} from '@phosphor-icons/react';
import { DesignItem, CategoryType } from '../../../types';
import { adminStore } from '../../../services/adminStore';
import { AdminDesignModal } from './AdminDesignModal';

interface Props {
  designs: DesignItem[];
}

export const AdminDesignsTab: React.FC<Props> = ({ designs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const [modalOpen, setModalOpen] = useState(false);
  const [designToEdit, setDesignToEdit] = useState<DesignItem | null>(null);

  const categories: { id: CategoryType; label: string }[] = [
    { id: 'all', label: 'جميع الأقسام' },
    { id: 'kitchens', label: 'مطابخ حديثة' },
    { id: 'bedrooms', label: 'غرف نوم' },
    { id: 'pvc-doors', label: 'أبواب ونوافذ و PVC' },
    { id: 'wardrobes', label: 'خزائن ملابس' },
    { id: 'interior-design', label: 'ديكورات وتصميم داخلي' },
  ];

  // Filtered designs
  const filteredDesigns = useMemo(() => {
    return designs.filter(d => {
      // Category
      if (selectedCategory !== 'all' && d.category !== selectedCategory) {
        return false;
      }
      // Featured
      if (onlyFeatured && !d.isFeatured) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = d.title.toLowerCase().includes(q);
        const matchDesc = (d.description || '').toLowerCase().includes(q);
        const matchTags = (d.tags || []).some(t => t.toLowerCase().includes(q));
        const matchMaterials = (d.materials || []).some(m => m.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTags && !matchMaterials) {
          return false;
        }
      }
      return true;
    });
  }, [designs, selectedCategory, onlyFeatured, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredDesigns.length / pageSize) || 1;
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDesigns.slice(start, start + pageSize);
  }, [filteredDesigns, currentPage]);

  const handleOpenAddModal = () => {
    setDesignToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: DesignItem) => {
    setDesignToEdit(item);
    setModalOpen(true);
  };

  const handleDelete = (item: DesignItem) => {
    if (window.confirm(`هل أنت متأكد من حذف التصميم: "${item.title}"؟\nلا يمكن التراجع عن هذا الإجراء.`)) {
      adminStore.deleteDesign(item.id);
    }
  };

  const handleToggleFeatured = (item: DesignItem) => {
    adminStore.toggleFeatured(item.id);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-ivory font-arabic">إدارة تصاميم المعرض</h2>
          <p className="text-xs text-brand-ivory/60">
            إجمالي {designs.length} تصميم متوفر على الموقع
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-gold to-amber-500 text-brand-dark hover:brightness-110 shadow-lg shadow-brand-gold/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle size={18} weight="bold" />
          <span>إضافة تصميم جديد</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-2xl bg-brand-surface border border-brand-gold/20 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-brand-ivory/40">
              <MagnifyingGlass size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ابحث بالاسم، الخامة، أو الوسم..."
              className="w-full pl-4 pr-10 py-2.5 bg-black/40 border border-brand-gold/25 rounded-xl text-xs text-brand-ivory placeholder:text-brand-ivory/30 focus:outline-none focus:border-brand-gold transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-4 relative">
            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value as CategoryType);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-black/40 border border-brand-gold/25 rounded-xl text-xs text-brand-ivory focus:outline-none focus:border-brand-gold transition-all"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id} className="bg-neutral-900 text-white">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Filter Toggle */}
          <div className="sm:col-span-2 flex items-center justify-end">
            <button
              onClick={() => {
                setOnlyFeatured(!onlyFeatured);
                setCurrentPage(1);
              }}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                onlyFeatured
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-black/40 text-brand-ivory/60 border-brand-gold/20 hover:text-brand-ivory'
              }`}
            >
              <Star size={14} weight={onlyFeatured ? 'fill' : 'regular'} />
              <span>المميزة فقط</span>
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-[11px] text-brand-ivory/50 pt-1 border-t border-brand-gold/10">
          <span>
            عرض {currentItems.length} من أصل {filteredDesigns.length} نتيجة مطابقة
          </span>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setOnlyFeatured(false);
              }}
              className="text-brand-gold hover:underline"
            >
              إلغاء الفلاتر
            </button>
          )}
        </div>
      </div>

      {/* Designs Table / Grid */}
      <div className="rounded-2xl bg-brand-surface border border-brand-gold/20 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-black/50 text-brand-gold border-b border-brand-gold/20 font-bold">
              <tr>
                <th className="p-3.5 sm:p-4">الصورة</th>
                <th className="p-3.5 sm:p-4">عنوان التصميم</th>
                <th className="p-3.5 sm:p-4 hidden sm:table-cell">القسم</th>
                <th className="p-3.5 sm:p-4 hidden md:table-cell">النمط والمساحة</th>
                <th className="p-3.5 sm:p-4 text-center">مميز</th>
                <th className="p-3.5 sm:p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gold/10 text-brand-ivory/90">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-brand-ivory/50">
                    لا توجد تصاميم مطابقة لمعايير البحث
                  </td>
                </tr>
              ) : (
                currentItems.map(item => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    {/* Thumbnail */}
                    <td className="p-3.5 sm:p-4 shrink-0">
                      <img
                        src={item.mainImage}
                        alt={item.title}
                        className="w-14 h-14 rounded-xl object-cover border border-brand-gold/20 shadow-sm"
                        onError={e => {
                          (e.target as HTMLImageElement).src = './projects/p1.jpg';
                        }}
                      />
                    </td>

                    {/* Title & Tags */}
                    <td className="p-3.5 sm:p-4 max-w-xs">
                      <div className="font-bold text-brand-ivory text-xs sm:text-sm line-clamp-1">
                        {item.title}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(item.tags || []).slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-brand-gold/80 border border-brand-gold/15"
                          >
                            #{tag.replace(/^#/, '')}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-3.5 sm:p-4 hidden sm:table-cell">
                      <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-brand-gold/20 text-brand-champagne text-[11px] font-medium">
                        {item.categoryArabic}
                      </span>
                    </td>

                    {/* Style & Space */}
                    <td className="p-3.5 sm:p-4 hidden md:table-cell text-brand-ivory/70 text-[11px]">
                      <div>{item.styleArabic}</div>
                      <div className="text-[10px] text-brand-ivory/50 font-mono mt-0.5">
                        {item.approximateArea || 'مساحة مخصصة'}
                      </div>
                    </td>

                    {/* Featured Toggle */}
                    <td className="p-3.5 sm:p-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(item)}
                        className={`p-1.5 rounded-lg transition-all ${
                          item.isFeatured
                            ? 'text-amber-400 hover:text-amber-300'
                            : 'text-brand-ivory/30 hover:text-brand-ivory/60'
                        }`}
                        title={item.isFeatured ? 'إلغاء التمييز' : 'تمييز هذا التصميم'}
                      >
                        <Star size={18} weight={item.isFeatured ? 'fill' : 'regular'} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 sm:p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Preview on site */}
                        <a
                          href={`#/designs/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-black/40 text-brand-ivory/70 hover:text-brand-gold hover:bg-black/60 transition-colors"
                          title="معاينة في الموقع"
                        >
                          <ArrowSquareOut size={16} />
                        </a>

                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg bg-black/40 text-sky-400 hover:bg-sky-500/20 border border-sky-500/30 transition-colors"
                          title="تعديل التصميم"
                        >
                          <PencilSimple size={16} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-lg bg-black/40 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
                          title="حذف التصميم"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-brand-gold/15 flex items-center justify-between bg-black/30">
            <span className="text-xs text-brand-ivory/60">
              صفحة {currentPage} من {totalPages}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-2 rounded-lg bg-black/40 border border-brand-gold/20 text-brand-ivory disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-gold/10 transition-colors"
              >
                <CaretRight size={16} />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-2 rounded-lg bg-black/40 border border-brand-gold/20 text-brand-ivory disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-gold/10 transition-colors"
              >
                <CaretLeft size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Add / Edit */}
      <AdminDesignModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        designToEdit={designToEdit}
        onSaveSuccess={() => {}}
      />
    </div>
  );
};
