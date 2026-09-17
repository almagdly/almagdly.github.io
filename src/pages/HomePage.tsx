import React, { useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedDesigns } from '../components/home/FeaturedDesigns';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { ServicesShowcase } from '../components/home/ServicesShowcase';
import { BeforeAfter } from '../components/home/BeforeAfter';
import { DesignProcess } from '../components/home/DesignProcess';
import { CompanyIntro } from '../components/home/CompanyIntro';
import { ConsultationCta } from '../components/home/ConsultationCta';
import { FullscreenViewer } from '../components/viewer/FullscreenViewer';
import { DesignItem } from '../types';
import { useAdminDesigns } from '../hooks/useAdminStore';

export const HomePage: React.FC = () => {
  const designsData = useAdminDesigns();
  const [selectedDesign, setSelectedDesign] = useState<DesignItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);


  const handleQuickView = (design: DesignItem) => {
    setSelectedDesign(design);
    setIsViewerOpen(true);
  };

  return (
    <div className="w-full">
      {/* 1. Hero Section (Photorealistic, Minimal, View & WhatsApp CTA) */}
      <HeroSection />

      {/* 2. Featured Projects (4-6 Curated Realistic Kitchen & Interior Projects) */}
      <FeaturedDesigns onQuickView={handleQuickView} />

      {/* 3. Portfolio Categories (Kitchens, Bedrooms, Wardrobes, Interior, 3D, Rendering) */}
      <CategoryGrid />

      {/* 4. Visual Services Section (6 Core Services with Images & Short Text) */}
      <ServicesShowcase />

      {/* 5. Before & After Visual Transformation */}
      <BeforeAfter />

      {/* 6. Why Choose Us (4 Points) & Our Process (4 Steps) */}
      <DesignProcess />

      {/* 7. About The Company (Logo, Strong Interior Photo, Trust Statement) */}
      <CompanyIntro />

      {/* 8. Final Call To Action */}
      <ConsultationCta />

      {/* Global Fullscreen Project Viewer & WhatsApp Inquirer */}
      <FullscreenViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        design={selectedDesign}
        onSelectDesign={setSelectedDesign}
        allDesigns={designsData}
      />
    </div>
  );
};
