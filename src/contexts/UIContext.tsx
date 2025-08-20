import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  isMobileNavOpen: boolean;
  toggleMobileNav: () => void;
  setMobileNavOpen: (isOpen: boolean) => void;
  expandedSections: string[];
  toggleSection: (sectionId: string) => void;
  setExpandedSections: (sections: string[]) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleMobileNav = () => {
    setMobileNavOpen(prev => !prev);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId) 
        : [...prev, sectionId]
    );
  };

  return (
    <UIContext.Provider value={{ 
      isMobileNavOpen, 
      toggleMobileNav, 
      setMobileNavOpen, 
      expandedSections, 
      toggleSection,
      setExpandedSections
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}