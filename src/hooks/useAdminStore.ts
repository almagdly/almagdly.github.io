import { useState, useEffect } from 'react';
import { adminStore } from '../services/adminStore';
import { DesignItem, BeforeAfterItem } from '../types';
import { InquiryItem, SiteSettings, SiteAnalytics } from '../types/admin';

export function useBeforeAfter(): BeforeAfterItem[] {
  const [items, setItems] = useState<BeforeAfterItem[]>(() => adminStore.getBeforeAfter());

  useEffect(() => {
    const unsubscribe = adminStore.subscribe(() => {
      setItems([...adminStore.getBeforeAfter()]);
    });
    return unsubscribe;
  }, []);

  return items;
}

export function useAdminDesigns(): DesignItem[] {
  const [designs, setDesigns] = useState<DesignItem[]>(() => adminStore.getDesigns());

  useEffect(() => {
    const unsubscribe = adminStore.subscribe(() => {
      setDesigns([...adminStore.getDesigns()]);
    });
    return unsubscribe;
  }, []);

  return designs;
}

export function useAdminInquiries(): InquiryItem[] {
  const [inquiries, setInquiries] = useState<InquiryItem[]>(() => adminStore.getInquiries());

  useEffect(() => {
    const unsubscribe = adminStore.subscribe(() => {
      setInquiries([...adminStore.getInquiries()]);
    });
    return unsubscribe;
  }, []);

  return inquiries;
}

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(() => adminStore.getSettings());

  useEffect(() => {
    const unsubscribe = adminStore.subscribe(() => {
      setSettings({ ...adminStore.getSettings() });
    });
    return unsubscribe;
  }, []);

  return settings;
}

export function useSiteAnalytics(): SiteAnalytics {
  const [analytics, setAnalytics] = useState<SiteAnalytics>(() => adminStore.getAnalytics());

  useEffect(() => {
    const unsubscribe = adminStore.subscribe(() => {
      setAnalytics({ ...adminStore.getAnalytics() });
    });
    return unsubscribe;
  }, []);

  return analytics;
}

export function useIsAdmin(): boolean {
  const [isAuth, setIsAuth] = useState<boolean>(() => adminStore.isAuthenticated());

  useEffect(() => {
    const unsubscribe = adminStore.subscribe(() => {
      setIsAuth(adminStore.isAuthenticated());
    });
    return unsubscribe;
  }, []);

  return isAuth;
}

