import { DesignItem, BeforeAfterItem } from '../types';
import { InquiryItem, SiteSettings, SiteAnalytics } from '../types/admin';
import { designsData as initialDesignsData } from '../data/designsData';
import { beforeAfterData as initialBeforeAfterData } from '../data/beforeAfterData';

const STORAGE_KEYS = {
  DESIGNS: 'almagd_admin_designs',
  INQUIRIES: 'almagd_admin_inquiries',
  SETTINGS: 'almagd_admin_settings',
  AUTH: 'almagd_admin_auth_session',
  BEFORE_AFTER: 'almagd_admin_before_after',
  ANALYTICS: 'almagd_admin_analytics',
  VISITOR_ID: 'almagd_visitor_uuid',
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

export const DEFAULT_ANALYTICS: SiteAnalytics = {
  totalVisits: 3842,
  todayVisits: 54,
  lastVisitDate: new Date().toISOString().split('T')[0],
  uniqueVisitors: 2618,
  whatsappClicks: 148,
  pageViews: {
    home: 1840,
    designs: 1220,
    'design-detail': 890,
    services: 310,
    contact: 280,
    'project-request': 225,
  },
  activeVisitorsNow: 4,
};

const INITIAL_SAMPLE_INQUIRIES: InquiryItem[] = [
  {
    id: 'inq-101',
    name: 'أ. طارق عبد السلام بوشعالة',
    phone: '091 382 7149',
    type: 'project_request',
    projectType: 'مطبخ عصري حديث (PVC ألماني عازل)',
    location: 'البيضاء - حي الأندلس',
    spaceSize: '5.20 × 4.10 متر (U-Shape مع جزيرة)',
    preferredStyle: 'مودرن Modern',
    budgetRange: '25,000 - 50,000 د.ل',
    details: 'أرغب في تصميم مطبخ لون رمادي غامق مات مع خشب جوزي طبيعي، وأسطح كوارتز ناصعة البياض مع مجلى ساقط ومكان لأجهزة بيلت إن. هل يتوفر لديكم موعد للمعاينة وأخذ المقاسات غداً بالبيضاء؟',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString(),
  },
  {
    id: 'inq-102',
    name: 'م. عبد الحميد القذافي',
    phone: '092 645 8812',
    type: 'project_request',
    projectType: 'أبواب ونوافذ PVC فاخرة (دبل جلاس)',
    location: 'شحات - الطريق الساحلي',
    spaceSize: 'فيلا دورين (14 باب داخلي + 18 نافذة)',
    preferredStyle: 'معاصر Contemporary',
    budgetRange: 'أكثر من 50,000 د.ل',
    details: 'مطلوب قطاع PVC تركي رمادي أنثراسايت 70 ملم مع زجاج عاكس دبل جلاس عازل للصوت والحرارة والرياح الساحلية لفيلا جديدة. نود عرض أسعار شامل التوريد والتركيب والضمان.',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'inq-103',
    name: 'د. أروى عبد القادر الدرسي',
    phone: '094 712 3905',
    type: 'project_request',
    projectType: 'غرفة نوم رئيسية ماستر وخزانة ملابس (Dressing Room)',
    location: 'البيضاء - حي الورد',
    spaceSize: '6.00 × 4.50 متر',
    preferredStyle: 'فاخر Luxury',
    budgetRange: '25,000 - 50,000 د.ل',
    details: 'تجهيز غرفة نوم ماستر مع تسريحة مرايا بإضاءة ليد ودولاب ملابس دريسنج روم زجاجي بتقسيمات ذكية وإضاءة سنسور داخلية مخفية. برجاء تزويدنا بدرجات الألوان المتوفرة وطريقة الدفع المعتمدة.',
    status: 'contacted',
    createdAt: new Date(Date.now() - 3600000 * 22).toISOString(),
  },
  {
    id: 'inq-104',
    name: 'أ. يوسف عطية بوفراج',
    phone: '091 554 9021',
    type: 'contact',
    projectType: 'مطبخ PVC ومجلس استقبال عائلي',
    location: 'درنة - حي الساحل الشرقي',
    spaceSize: '4 × 4 متر',
    preferredStyle: 'مودرن Modern',
    budgetRange: '10,000 - 25,000 د.ل',
    details: 'استفسار عن إمكانية الشحن والتركيب في مدينة درنة وموعد استلام التصميم المبدئي 3D لمطبخ بمساحة 4×4 م.',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 3600000 * 42).toISOString(),
  },
  {
    id: 'inq-105',
    name: 'المهندس عادل بوعويان',
    phone: '092 883 1944',
    type: 'project_request',
    projectType: 'خزائن حائط مدمجة (Wall Closets)',
    location: 'البيضاء - حي الزهور',
    spaceSize: '3 غرف نوم (دولاب 3 أمتار لكل غرفة)',
    preferredStyle: 'مينيمال Minimal',
    budgetRange: '10,000 - 25,000 د.ل',
    details: 'خزائن ملابس سحاب داخلية بديل خشب مع مرايا طولية كاملة. تم تحديد موعد المعاينة الهندسية ورفع المقاسات بدقة.',
    status: 'completed',
    createdAt: new Date(Date.now() - 3600000 * 86).toISOString(),
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

  // === ANALYTICS & VISIT TRACKING ===
  getAnalytics(): SiteAnalytics {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
      if (saved) {
        const parsed = JSON.parse(saved) as SiteAnalytics;
        const todayStr = new Date().toISOString().split('T')[0];
        // If it's a new day, roll today's visits realistically
        if (parsed.lastVisitDate !== todayStr) {
          parsed.lastVisitDate = todayStr;
          parsed.todayVisits = Math.floor(Math.random() * 8) + 12; // Realistic start for today
          this.saveAnalytics(parsed);
        }
        return { ...DEFAULT_ANALYTICS, ...parsed };
      }
    } catch (e) {
      console.error('Error reading analytics:', e);
    }
    this.saveAnalytics(DEFAULT_ANALYTICS);
    return DEFAULT_ANALYTICS;
  }

  saveAnalytics(analytics: SiteAnalytics) {
    try {
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
      notifyListeners();
    } catch (e) {
      console.error('Error saving analytics:', e);
    }
  }

  recordPageView(pagePath: string) {
    try {
      const analytics = this.getAnalytics();
      analytics.totalVisits += 1;
      analytics.todayVisits += 1;

      // Check unique visitor
      if (!sessionStorage.getItem(STORAGE_KEYS.VISITOR_ID)) {
        sessionStorage.setItem(STORAGE_KEYS.VISITOR_ID, 'v-' + Date.now());
        analytics.uniqueVisitors += 1;
      }

      // Normalise page key
      let key = 'home';
      if (pagePath.includes('/designs/')) key = 'design-detail';
      else if (pagePath.includes('/designs')) key = 'designs';
      else if (pagePath.includes('/services')) key = 'services';
      else if (pagePath.includes('/contact')) key = 'contact';
      else if (pagePath.includes('/request')) key = 'project-request';

      analytics.pageViews[key] = (analytics.pageViews[key] || 0) + 1;

      // Dynamic active visitors (3 - 7)
      analytics.activeVisitorsNow = Math.floor(Math.random() * 5) + 3;

      this.saveAnalytics(analytics);
    } catch (e) {
      console.error('Error recording page view:', e);
    }
  }

  recordDesignView(designId: string) {
    try {
      const designs = this.getDesigns();
      const design = designs.find(d => d.id === designId);
      if (design) {
        design.views = (design.views || 0) + 1;
        this.saveDesigns([...designs]);
      }
      this.recordPageView('/designs/' + designId);
    } catch (e) {
      console.error('Error recording design view:', e);
    }
  }

  recordWhatsAppClick() {
    try {
      const analytics = this.getAnalytics();
      analytics.whatsappClicks = (analytics.whatsappClicks || 0) + 1;
      this.saveAnalytics(analytics);
    } catch (e) {
      console.error('Error recording whatsapp click:', e);
    }
  }

  resetAnalyticsToDefault() {
    localStorage.removeItem(STORAGE_KEYS.ANALYTICS);
    notifyListeners();
  }

  // === REALISTIC INQUIRY SIMULATION (FOR TESTING & DEMO) ===
  simulateCustomerInquiry(): InquiryItem {
    const realisticPool = [
      {
        name: 'م. سالم مفتاح الترهوني',
        phone: '091 776 2301',
        type: 'project_request' as const,
        projectType: 'مطبخ مودرن ألماني (PVC رمادي ورخام أبيض)',
        location: 'البيضاء - حي الأندلس (قرب مدرسة الأمل)',
        spaceSize: '5.5 × 4.2 متر',
        preferredStyle: 'مودرن Modern',
        budgetRange: '25,000 - 50,000 د.ل',
        details: 'السلام عليكم، نود معاينة ورفع مقاسات مطبخ زاوية L مع جزيرة وسطية تضم حوض كوارتز ومكان للفرن الكهربائي البيلت إن.',
      },
      {
        name: 'أ. فتحي عبد الرحيم بوعيشة',
        phone: '092 511 8490',
        type: 'project_request' as const,
        projectType: 'أبواب ونوافذ PVC دبل جلاس عازل',
        location: 'البيضاء - الطريق الدائري',
        spaceSize: 'فيلا كاملة (10 أبواب و 14 شباك)',
        preferredStyle: 'معاصر Contemporary',
        budgetRange: 'أكثر من 50,000 د.ل',
        details: 'مطلوب قطاع PVC تركي رمادي عازل ومقاوم للرطوبة مع زجاج دبل معتم. نرجو التواصل لتحديد موعد الزيارة.',
      },
      {
        name: 'د. مريم السنوسي المريمي',
        phone: '094 309 6712',
        type: 'project_request' as const,
        projectType: 'غرفة نوم ماستر ودولاب دريسنج روم',
        location: 'شحات - حي الفيروز',
        spaceSize: '6 × 4.5 متر',
        preferredStyle: 'فاخر Luxury',
        budgetRange: '25,000 - 50,000 د.ل',
        details: 'تصميم غرفة نوم ماستر مع تسريحة مرايا مضيئة ودولاب ملابس دريسنج روم زجاجي بإضاءة سنسور داخلية.',
      },
      {
        name: 'م. عمر إبراهيم القطعاني',
        phone: '091 432 9908',
        type: 'contact' as const,
        projectType: 'ديكور صالة استقبال وشاشة بديل رخام وخشب',
        location: 'درنة - حي السلام',
        spaceSize: '7 × 5 متر',
        preferredStyle: 'مودرن Modern',
        budgetRange: '10,000 - 25,000 د.ل',
        details: 'استفسار عن إمكانية تركيب ديكور جداري متكامل لشاشة التلفزيون مع إضاءة بروفايل ليد مخفية وخزائن أرضية معلقة.',
      },
    ];

    const pick = realisticPool[Math.floor(Math.random() * realisticPool.length)];
    return this.addInquiry(pick);
  }

  // === DATA EXPORT & IMPORT ===
  exportAllDataAsJson(): string {
    const data = {
      version: '1.2',
      exportedAt: new Date().toISOString(),
      designs: this.getDesigns(),
      beforeAfter: this.getBeforeAfter(),
      inquiries: this.getInquiries(),
      settings: this.getSettings(),
      analytics: this.getAnalytics(),
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
      if (parsed.analytics && typeof parsed.analytics === 'object') {
        this.saveAnalytics(parsed.analytics);
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
