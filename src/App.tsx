import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';
import { Toast } from './components/ui/Toast';

// Pages
import { HomePage } from './pages/HomePage';
import { DesignsPage } from './pages/DesignsPage';
import { DesignDetailPage } from './pages/DesignDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { ProjectRequestPage } from './pages/ProjectRequestPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/admin/AdminPage';

import { adminStore } from './services/adminStore';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Fetch latest published data from repo for all visitors
  React.useEffect(() => {
    adminStore.fetchRemotePublishedData();
  }, []);

  // Real-time visitor analytics tracking
  React.useEffect(() => {
    if (!isAdminRoute) {
      adminStore.recordPageView(location.pathname);
    }
  }, [location.pathname, isAdminRoute]);

  return (
    <div className="flex flex-col min-h-screen bg-brand-dark text-brand-ivory font-arabic selection:bg-brand-gold selection:text-brand-dark">
      {/* Main Top Navigation (hidden in admin) */}
      {!isAdminRoute && <Navbar />}


      {/* Page Routing */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/designs" element={<DesignsPage />} />
          <Route path="/designs/:slug" element={<DesignDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/request" element={<ProjectRequestPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* Fallback route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Footer & Floating Actions (hidden in admin) */}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingWhatsApp />}

      {/* Global Toast Alerts */}
      <Toast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <FavoritesProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </FavoritesProvider>
  );
};

export default App;
