import React, { createContext, useContext, useState, useEffect } from 'react';
import { DesignItem } from '../types';
import { adminStore } from '../services/adminStore';

interface FavoritesContextType {
  favoriteIds: string[];
  favoriteItems: DesignItem[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  clearFavorites: () => void;
  selectedIds: string[];
  toggleSelect: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  isAllSelected: boolean;
  toastMessage: string | null;
  clearToast: () => void;
}

const STORAGE_KEY = 'al_magd_favs_v3';
const DEFAULT_FAVORITES = ['mg-k-01', 'mg-b-01', 'mg-w-01'];

function getSafeInitialFavorites(): string[] {
  try {
    if (typeof window === 'undefined') return DEFAULT_FAVORITES;
    
    // Clean old keys if present
    ['al_magd_favorites_v1', 'al_magd_favorites_v2', 'al_magd_favorites'].forEach(oldKey => {
      try { localStorage.removeItem(oldKey); } catch {}
    });

    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_FAVORITES;
    
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      const allDesigns = adminStore.getDesigns();
      const valid = parsed.filter((id): id is string => 
        typeof id === 'string' && allDesigns.some(d => d.id === id)
      );
      return valid.length > 0 ? valid : DEFAULT_FAVORITES;
    }
  } catch (err) {
    console.warn('LocalStorage error in FavoritesProvider:', err);
  }
  return DEFAULT_FAVORITES;
}


const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(getSafeInitialFavorites);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with localStorage safely
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && Array.isArray(favoriteIds)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
      }
    } catch (e) {
      console.warn('Failed to save favorites to localStorage', e);
    }
  }, [favoriteIds]);

  // Keep selected IDs in sync
  useEffect(() => {
    if (Array.isArray(favoriteIds)) {
      setSelectedIds(prev => (Array.isArray(prev) ? prev.filter(id => favoriteIds.includes(id)) : []));
    }
  }, [favoriteIds]);

  const isFavorite = (id: string): boolean => {
    return Array.isArray(favoriteIds) && favoriteIds.includes(id);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3000);
  };

  const clearToast = () => setToastMessage(null);

  const addToFavorites = (id: string) => {
    if (Array.isArray(favoriteIds) && !favoriteIds.includes(id)) {
      setFavoriteIds(prev => [...prev, id]);
      const design = adminStore.getDesigns().find(d => d.id === id);
      showToast(`تمت إضافة "${design?.title || 'التصميم'}" إلى المفضلة`);
    }
  };

  const removeFromFavorites = (id: string) => {
    setFavoriteIds(prev => (Array.isArray(prev) ? prev.filter(item => item !== id) : []));
    setSelectedIds(prev => (Array.isArray(prev) ? prev.filter(item => item !== id) : []));
    const design = adminStore.getDesigns().find(d => d.id === id);
    showToast(`تمت إزالة "${design?.title || 'التصميم'}" من المفضلة`);
  };

  const toggleFavorite = (id: string) => {
    if (isFavorite(id)) {
      removeFromFavorites(id);
    } else {
      addToFavorites(id);
    }
  };

  const clearFavorites = () => {
    setFavoriteIds([]);
    setSelectedIds([]);
    showToast('تم إفراغ قائمة المفضلة');
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const list = Array.isArray(prev) ? prev : [];
      return list.includes(id) ? list.filter(item => item !== id) : [...list, id];
    });
  };

  const selectAll = () => {
    setSelectedIds(Array.isArray(favoriteIds) ? favoriteIds : []);
  };

  const deselectAll = () => {
    setSelectedIds([]);
  };

  const safeFavoriteIds = Array.isArray(favoriteIds) ? favoriteIds : [];
  const safeSelectedIds = Array.isArray(selectedIds) ? selectedIds : [];

  const isAllSelected = safeFavoriteIds.length > 0 && safeSelectedIds.length === safeFavoriteIds.length;

  const favoriteItems = adminStore.getDesigns().filter(d => safeFavoriteIds.includes(d.id));


  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds: safeFavoriteIds,
        favoriteItems,
        isFavorite,
        toggleFavorite,
        addToFavorites,
        removeFromFavorites,
        clearFavorites,
        selectedIds: safeSelectedIds,
        toggleSelect,
        selectAll,
        deselectAll,
        isAllSelected,
        toastMessage,
        clearToast
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    return {
      favoriteIds: DEFAULT_FAVORITES,
      favoriteItems: adminStore.getDesigns().filter(d => DEFAULT_FAVORITES.includes(d.id)),
      isFavorite: () => false,

      toggleFavorite: () => {},
      addToFavorites: () => {},
      removeFromFavorites: () => {},
      clearFavorites: () => {},
      selectedIds: [],
      toggleSelect: () => {},
      selectAll: () => {},
      deselectAll: () => {},
      isAllSelected: false,
      toastMessage: null,
      clearToast: () => {},
    };
  }
  return context;
};
