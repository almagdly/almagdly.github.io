import { adminStore } from './adminStore';
import { DesignItem, BeforeAfterItem } from '../types';
import { SiteSettings } from '../types/admin';

export interface PublishedSiteData {
  version: string;
  updatedAt: string;
  settings: SiteSettings;
  designs: DesignItem[];
  beforeAfter: BeforeAfterItem[];
}

// Robust UTF-8 to Base64 for Arabic and international characters
function toBase64Unicode(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

class GitHubSyncService {
  private isSyncing = false;

  public isCurrentlySyncing(): boolean {
    return this.isSyncing;
  }

  public async testConnection(): Promise<{ success: boolean; message: string; repo?: string }> {
    const settings = adminStore.getSettings();
    const token = settings.githubToken?.trim();
    const repo = settings.githubRepo?.trim() || 'almagdly/almagdly.github.io';

    if (!token) {
      return { success: false, message: 'يرجى إدخال رمز الوصول الشخصي (GitHub Token).' };
    }

    try {
      const res = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          return { success: false, message: 'رمز الوصول الشخصي (Token) غير صالح أو منتهي الصلاحية.' };
        }
        if (res.status === 404) {
          return { success: false, message: `المستودع ${repo} غير موجود أو لا يملك الحساب صلاحية الوصول إليه.` };
        }
        return { success: false, message: `خطأ من GitHub: ${res.statusText}` };
      }

      const data = await res.json();
      const canPush = Boolean(data.permissions?.push || data.permissions?.admin);
      if (!canPush) {
        return {
          success: false,
          message: 'الحساب لا يملك صلاحية الرفع (Push) لهذا المستودع.',
          repo: data.full_name,
        };
      }

      return {
        success: true,
        message: 'الاتصال بالمستودع ناجح وصلاحية الرفع مؤكدة 100%!',
        repo: data.full_name,
      };
    } catch (e: any) {
      return { success: false, message: `فشل الاتصال: ${e.message || 'خطأ في الشبكة'}` };
    }
  }

  /**
   * Commit site-data.json directly to GitHub repository
   */
  public async publishToGitHub(options?: { commitMessage?: string }): Promise<{
    success: boolean;
    message: string;
    commitUrl?: string;
  }> {
    if (this.isSyncing) {
      return { success: false, message: 'تجري عملية مزامنة أخرى حالياً، يرجى الانتظار ثوانٍ.' };
    }

    const settings = adminStore.getSettings();
    const token = settings.githubToken?.trim();
    const repo = settings.githubRepo?.trim() || 'almagdly/almagdly.github.io';
    const branch = settings.githubBranch?.trim() || 'main';

    if (!token) {
      return {
        success: false,
        message: 'لم يتم العثور على رمز الوصول (GitHub Token). يرجى إضافته من تبويب الإعدادات.',
      };
    }

    this.isSyncing = true;
    this.notifySyncStatus({ isSyncing: true, message: 'جاري نشر التعديلات للمستودع والموقع...' });

    try {
      // 1. Prepare published payload (strip private token & pin from public repository file)
      const rawSettings = adminStore.getSettings();
      const safeSettings: SiteSettings = {
        ...rawSettings,
        githubToken: '',
      };
      delete (safeSettings as any).adminPin;

      const payload: PublishedSiteData = {
        version: '1.0',
        updatedAt: new Date().toISOString(),
        settings: safeSettings,
        designs: adminStore.getDesigns(),
        beforeAfter: adminStore.getBeforeAfter(),
      };

      const contentString = JSON.stringify(payload, null, 2);
      const base64Content = toBase64Unicode(contentString);
      const commitMessage =
        options?.commitMessage ||
        `chore: update site content from Admin Dashboard [${new Date().toLocaleDateString('ar-LY')}]`;

      // Update both docs/site-data.json and site-data.json
      const targetPaths = ['docs/site-data.json', 'site-data.json'];
      let lastCommitUrl = '';

      for (const filePath of targetPaths) {
        // Get existing file SHA if exists
        let fileSha: string | undefined;
        try {
          const getRes = await fetch(
            `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
              },
            }
          );
          if (getRes.ok) {
            const fileData = await getRes.json();
            fileSha = fileData.sha;
          }
        } catch {
          // File might not exist yet, which is fine
        }

        // Push / PUT content
        const putBody: any = {
          message: `${commitMessage} (${filePath})`,
          content: base64Content,
          branch,
        };
        if (fileSha) {
          putBody.sha = fileSha;
        }

        const putRes = await fetch(
          `https://api.github.com/repos/${repo}/contents/${filePath}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/vnd.github.v3+json',
            },
            body: JSON.stringify(putBody),
          }
        );

        if (!putRes.ok) {
          const errData = await putRes.json().catch(() => ({}));
          throw new Error(errData.message || `HTTP ${putRes.status}: فشل رفع ${filePath}`);
        }

        const resultData = await putRes.json();
        lastCommitUrl = resultData.commit?.html_url || '';
      }

      // Update last sync time in settings
      adminStore.updateSettings({
        lastSyncTime: new Date().toISOString(),
      });

      const successMsg = 'تم نشر التعديلات بنجاح تام إلى المستودع! ستظهر في الموقع لجميع الزوار خلال لحظات.';
      this.notifySyncStatus({ isSyncing: false, success: true, message: successMsg });

      return {
        success: true,
        message: successMsg,
        commitUrl: lastCommitUrl,
      };
    } catch (e: any) {
      console.error('Error syncing to GitHub:', e);
      const errorMsg = `تعذر النشر إلى المستودع: ${e.message || 'خطأ غير معروف'}`;
      this.notifySyncStatus({ isSyncing: false, success: false, message: errorMsg });
      return {
        success: false,
        message: errorMsg,
      };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Pull the latest published site-data.json from GitHub/hosting
   */
  public async pullFromRemote(): Promise<{ success: boolean; message: string }> {
    const settings = adminStore.getSettings();
    const repo = settings.githubRepo?.trim() || 'almagdly/almagdly.github.io';
    const branch = settings.githubBranch?.trim() || 'main';

    const urls = [
      `./site-data.json?t=${Date.now()}`,
      `https://raw.githubusercontent.com/${repo}/${branch}/docs/site-data.json?t=${Date.now()}`,
      `https://raw.githubusercontent.com/${repo}/${branch}/site-data.json?t=${Date.now()}`,
    ];

    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data: PublishedSiteData = await res.json();
          if (data.designs && Array.isArray(data.designs)) {
            adminStore.applyPublishedData(data);
            return {
              success: true,
              message: `تم سحب وتطبيق أحدث البيانات من المستودع بنجاح (تاريخ التحديث: ${new Date(
                data.updatedAt
              ).toLocaleTimeString('ar-LY')}).`,
            };
          }
        }
      } catch {
        // try next
      }
    }

    return {
      success: false,
      message: 'لم يتم العثور على ملف بيانات منشور في المستودع حتى الآن.',
    };
  }

  /**
   * Fetch official traffic and visitor analytics directly from GitHub API
   */
  public async fetchTrafficData(): Promise<{
    success: boolean;
    data?: any;
    message: string;
  }> {
    const settings = adminStore.getSettings();
    const token = settings.githubToken?.trim();
    const repo = settings.githubRepo?.trim() || 'almagdly/almagdly.github.io';

    if (!token) {
      return { success: false, message: 'رمز الوصول الشخصي غير متوفر.' };
    }

    try {
      const res = await fetch(`https://api.github.com/repos/${repo}/traffic/views`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!res.ok) {
        return { success: false, message: `تعذر جلب بيانات الزيارات من GitHub (${res.statusText})` };
      }

      const data = await res.json();
      const analytics = adminStore.getAnalytics();
      const totalViews = data.count || 0;
      const uniqueViews = data.uniques || 0;

      analytics.githubViewsCount = totalViews;
      analytics.githubUniquesCount = uniqueViews;
      analytics.githubViewsHistory = data.views || [];
      analytics.lastTrafficFetch = new Date().toISOString();

      // Check today's views from GitHub traffic
      const todayIso = new Date().toISOString().split('T')[0];
      const todayEntry = (data.views || []).find((v: any) => v.timestamp?.startsWith(todayIso));
      if (todayEntry) {
        analytics.todayVisits = Math.max(analytics.todayVisits || 0, todayEntry.count);
      }

      // Aggregate: totalVisits is at least the verified GitHub count
      analytics.totalVisits = Math.max(analytics.totalVisits || 0, totalViews);
      analytics.uniqueVisitors = Math.max(analytics.uniqueVisitors || 0, uniqueViews);

      // Save updated analytics to store
      adminStore.saveAnalytics(analytics);

      return {
        success: true,
        data,
        message: `تم جلب بيانات الزيارات الحقيقية بنجاح من GitHub (${totalViews} زيارة موثقة).`,
      };
    } catch (e: any) {
      return { success: false, message: `فشل الاتصال: ${e.message || 'خطأ غير معروف'}` };
    }
  }

  // === SYNC STATUS LISTENERS ===
  private syncListeners = new Set<(status: { isSyncing: boolean; message?: string; success?: boolean }) => void>();

  public subscribeSyncStatus(fn: (status: { isSyncing: boolean; message?: string; success?: boolean }) => void) {
    this.syncListeners.add(fn);
    return () => {
      this.syncListeners.delete(fn);
    };
  }

  public notifySyncStatus(status: { isSyncing: boolean; message?: string; success?: boolean }) {
    this.syncListeners.forEach(fn => {
      try {
        fn(status);
      } catch {}
    });
  }
}

export const githubSync = new GitHubSyncService();
