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
  githubToken?: string;
  githubRepo?: string;
  githubBranch?: string;
  autoSyncToGithub?: boolean;
  lastSyncTime?: string;
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
  cities?: Record<string, number>;
  sources?: Record<string, number>;
  visitorLogs?: Array<{
    id: string;
    city: string;
    region?: string;
    country: string;
    source: string;
    sourceDetail?: string;
    device: string;
    timestamp: string;
    page: string;
  }>;
  activeVisitors?: number;
  githubViewsCount?: number;
  githubUniquesCount?: number;
  githubViewsHistory?: Array<{ timestamp: string; count: number; uniques: number }>;
  lastTrafficFetch?: string;
}
