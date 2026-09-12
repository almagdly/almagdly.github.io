import { DesignItem, BeforeAfterItem } from '../types';
import { InquiryItem, SiteSettings } from '../types/admin';
import { designsData as initialDesignsData } from '../data/designsData';
import { beforeAfterData as initialBeforeAfterData } from '../data/beforeAfterData';

const STORAGE_KEYS = {
  DESIGNS: 'almagd_admin_designs',
  INQUIRIES: 'almagd_admin_inquiries',
  SETTINGS: 'almagd_admin_settings',
  AUTH: 'almagd_admin_auth_session',
  BEFORE_AFTER: 'almagd_admin_before_after',
};

export const DEFAULT_SETTINGS: SiteSettings = {
  phone: '094 5919679',
  whatsapp: '218945919679',
  facebookUrl: 'https://www.facebook.com/p/%D8%B4%D8%B1%D9%83%D8%A9-%D8%A7%D9%84%D9%85%D8%AC%D8%AF-%D9%84%D9%84%D9%85%D8%B7%D8%A7%D8%A8%D8%AE-%D8%A7%D9%84%D8%AD%D8%AF%D9%8A%D8%AB%D8%A9-%D9%88-P-V-C-100041790767867/',
  tiktokUrl: 'https://tiktok.com/@almajdone?_r=1&_t=ZS-99ataXUqlyk',
  address: 'ليبيا - البيضاء، شارع القهاوي (بالقرب من قرطاسية بغداد)',
  workingHours: 'السبت - الخميس: 9:00 ص - 9:00 م',
  adminPin: '2026',
  heroImage: './projects/p1.jpg',
  heroTagline: 'شركة المجد للمطابخ الحديثة، غرف النوم، والديكورات الداخلية — البيضاء',
};

const INITIAL_SAMPLE_INQUIRIES: InquiryItem[] = [
  {
    id: 'inq-101',
    name: 'أحمد الحاسي',
    phone: '0912345678',
    type: 'project_request',
    projectType: 'مطبخ عصري (PVC / MDF)',
    location: 'البيضاء - حي الزهور',
    spaceSize: '4 × 5 متر',
    preferredStyle: 'مودرن Modern',
    budgetRange: 'متوسط إلى فاخر',
    details: 'أرغب في تصميم مطبخ حرف L مع كاونتر إفطار وأجهزة بيلت إن',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'inq-102',
    name: 'م. سالم المنفي',
    phone: '0925554321',
    type: 'project_request',
    projectType: 'أبواب ونوافذ PVC',
    location: 'البيضاء - الطريق الدائري',
    spaceSize: 'فيلا كاملة (12 باب و 16 نافذة)',
    preferredStyle: 'عصري كلاسيك',
    budgetRange: 'شامل التركيب',
    details: 'مطلوب قطاع PVC تركي عازل للصوت والحرارة بزجاج مزدوج',
    status: 'contacted',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'inq-103',
    name: 'د. فاطمة العبيدي',
    phone: '0948765432',
    type: 'contact',
    projectType: 'غرفة نوم ماستر وخزانة ملابس',
    location: 'شحات',
    details: 'استفسار عن إمكانية معاينة وأخذ المقاسات في شحات الأسبوع القادم',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.error('Listener error:', e);
    }
  });
}

class AdminStore {
  // === DESIGNS ===
  getDesigns(): DesignItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DESIGNS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading designs from storage:', e);
    }
    return initialDesignsData;
  }

  saveDesigns(designs: DesignItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.DESIGNS, JSON.stringify(designs));
      notifyListeners();
    } catch (e) {
      console.error('Error saving designs to storage:', e);
    }
  }

  addDesign(design: Omit<DesignItem, 'id' | 'views' | 'favoritesCount' | 'dateAdded' | 'isMostViewed'>): DesignItem {
    const designs = this.getDesigns();
    const newId = 'custom-' + Date.now();
    const newDesign: DesignItem = {
      ...design,
      id: newId,
      views: 0,
      favoritesCount: 0,
      dateAdded: new Date().toISOString().split('T')[0],
      isMostViewed: false,
    };
    const updated = [newDesign, ...designs];
    this.saveDesigns(updated);
    return newDesign;
  }

  updateDesign(id: string, updates: Partial<DesignItem>): boolean {
    const designs = this.getDesigns();
    const index = designs.findIndex(d => d.id === id);
    if (index === -1) return false;

    designs[index] = { ...designs[index], ...updates };
    this.saveDesigns([...designs]);
    return true;
  }

  deleteDesign(id: string): boolean {
    const designs = this.getDesigns();
    const updated = designs.filter(d => d.id !== id);
    if (updated.length === designs.length) return false;
    this.saveDesigns(updated);
    return true;
  }

  toggleFeatured(id: string): boolean {
    const designs = this.getDesigns();
    const design = designs.find(d => d.id === id);
    if (!design) return false;
    design.isFeatured = !design.isFeatured;
    this.saveDesigns([...designs]);
    return true;
  }

  resetDesignsToDefault() {
    localStorage.removeItem(STORAGE_KEYS.DESIGNS);
    notifyListeners();
  }

  // === BEFORE & AFTER ===
  getBeforeAfter(): BeforeAfterItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BEFORE_AFTER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading before/after from storage:', e);
    }
    return initialBeforeAfterData;
  }

  saveBeforeAfter(items: BeforeAfterItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.BEFORE_AFTER, JSON.stringify(items));
      notifyListeners();
    } catch (e) {
      console.error('Error saving before/after:', e);
    }
  }

  addBeforeAfter(item: Omit<BeforeAfterItem, 'id'>): BeforeAfterItem {
    const current = this.getBeforeAfter();
    const newItem: BeforeAfterItem = {
      ...item,
      id: 'ba-' + Date.now(),
    };
    const updated = [newItem, ...current];
    this.saveBeforeAfter(updated);
    return newItem;
  }

  updateBeforeAfter(id: string, updates: Partial<BeforeAfterItem>): boolean {
    const items = this.getBeforeAfter();
    const index = items.findIndex(b => b.id === id);
    if (index === -1) return false;

    items[index] = { ...items[index], ...updates };
    this.saveBeforeAfter([...items]);
    return true;
  }

  deleteBeforeAfter(id: string): boolean {
    const items = this.getBeforeAfter();
    const updated = items.filter(b => b.id !== id);
    if (updated.length === items.length) return false;
    this.saveBeforeAfter(updated);
    return true;
  }

  resetBeforeAfterToDefault() {
    localStorage.removeItem(STORAGE_KEYS.BEFORE_AFTER);
    notifyListeners();
  }

  // === INQUIRIES ===
  getInquiries(): InquiryItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error reading inquiries:', e);
    }
    this.saveInquiries(INITIAL_SAMPLE_INQUIRIES);
    return INITIAL_SAMPLE_INQUIRIES;
  }

  saveInquiries(inquiries: InquiryItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
      notifyListeners();
    } catch (e) {
      console.error('Error saving inquiries:', e);
    }
  }

  addInquiry(item: Omit<InquiryItem, 'id' | 'createdAt' | 'status'>): InquiryItem {
    const current = this.getInquiries();
    const newInquiry: InquiryItem = {
      ...item,
      id: 'inq-' + Date.now(),
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    const updated = [newInquiry, ...current];
    this.saveInquiries(updated);
    return newInquiry;
  }

  updateInquiryStatus(id: string, status: InquiryItem['status']): boolean {
    const current = this.getInquiries();
    const item = current.find(i => i.id === id);
    if (!item) return false;
    item.status = status;
    this.saveInquiries([...current]);
    return true;
  }

  deleteInquiry(id: string): boolean {
    const current = this.getInquiries();
    const updated = current.filter(i => i.id !== id);
    if (updated.length === current.length) return false;
    this.saveInquiries(updated);
    return true;
  }

  // === SETTINGS ===
  getSettings(): SiteSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error reading settings:', e);
    }
    return DEFAULT_SETTINGS;
  }

  updateSettings(updates: Partial<SiteSettings>) {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    notifyListeners();
  }

  verifyPin(pin: string): boolean {
    const settings = this.getSettings();
    return pin.trim() === settings.adminPin.trim();
  }

  changePin(newPin: string): boolean {
    if (!newPin || newPin.trim().length < 4) return false;
    this.updateSettings({ adminPin: newPin.trim() });
    return true;
  }

  // === AUTHENTICATION ===
  isAuthenticated(): boolean {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true' || 
             localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  }

  login(pin: string, rememberMe = true): boolean {
    if (this.verifyPin(pin)) {
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      } else {
        sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      }
      notifyListeners();
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    notifyListeners();
  }

  // === DATA EXPORT & IMPORT ===
  exportAllDataAsJson(): string {
    const data = {
      version: '1.1',
      exportedAt: new Date().toISOString(),
      designs: this.getDesigns(),
      beforeAfter: this.getBeforeAfter(),
      inquiries: this.getInquiries(),
      settings: this.getSettings(),
    };
    return JSON.stringify(data, null, 2);
  }

  importAllDataFromJson(jsonStr: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.designs && Array.isArray(parsed.designs)) {
        this.saveDesigns(parsed.designs);
      }
      if (parsed.beforeAfter && Array.isArray(parsed.beforeAfter)) {
        this.saveBeforeAfter(parsed.beforeAfter);
      }
      if (parsed.inquiries && Array.isArray(parsed.inquiries)) {
        this.saveInquiries(parsed.inquiries);
      }
      if (parsed.settings && typeof parsed.settings === 'object') {
        this.updateSettings(parsed.settings);
      }
      return { success: true, message: 'تم استيراد كافة البيانات وتحديث الموقع بنجاح!' };
    } catch (err: any) {
      return { success: false, message: 'فشل استيراد الملف: ' + err.message };
    }
  }

  // === REACT SUBSCRIPTION ===
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }
}

export const adminStore = new AdminStore();
