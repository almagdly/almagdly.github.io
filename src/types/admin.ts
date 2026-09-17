export interface InquiryItem {
  id: string;
  name: string;
  phone: string;
  type: 'project_request' | 'contact';
  projectType: string;
  location?: string;
  spaceSize?: string;
  preferredStyle?: string;
  budgetRange?: string;
  details?: string;
  status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface SiteSettings {
  phone: string;
  whatsapp: string;
  facebookUrl: string;
  tiktokUrl: string;
  address: string;
  workingHours: string;
  adminPin: string;
  heroImage?: string;
  heroTagline?: string;
  homepageDesignIds?: string[];
}
export interface SiteAnalytics {
  totalVisits: number;
  todayVisits: number;
  lastVisitDate: string;
  uniqueVisitors: number;
  whatsappClicks: number;
  pageViews: Record<string, number>;
  devices?: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}
