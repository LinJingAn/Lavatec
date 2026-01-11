import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';

interface SidebarContextProps {
  showSecondarySidebar: boolean;
  closeSecondarySidebar: () => void;
  openSecondarySidebar: (title: string, items: { to: string; label: string }[]) => void;
  secondarySidebarTitle: string;
  secondarySidebarItems: { to: string; label: string }[];
  isManualToggle: boolean;
  setManualToggle: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [showSecondarySidebar, setShowSecondarySidebar] = useState(false);
  const [secondarySidebarTitle, setSecondarySidebarTitle] = useState('');
  const [secondarySidebarItems, setSecondarySidebarItems] = useState<{ to: string; label: string }[]>([]);
  const [isManualToggle, setManualToggle] = useState(false);

  // Use separate function for logging state changes
  useEffect(() => {
    console.log('SidebarContext state changed:', { 
      showSecondarySidebar, 
      secondarySidebarTitle,
      itemsCount: secondarySidebarItems.length,
      isManualToggle
    });
  }, [showSecondarySidebar, secondarySidebarTitle, secondarySidebarItems, isManualToggle]);

  const openSecondarySidebar = (title: string, items: { to: string; label: string }[]) => {
    console.log('openSecondarySidebar called with:', title, items.length);
    // Ensure we're setting the items first, then showing the sidebar
    setSecondarySidebarTitle(title);
    setSecondarySidebarItems(items);
    // Small delay to ensure the above state updates complete before showing the sidebar
    setTimeout(() => {
      setShowSecondarySidebar(true);
      console.log('Secondary sidebar should now be visible');
    }, 10);
  };

  const closeSecondarySidebar = () => {
    console.log('closeSecondarySidebar called');
    setShowSecondarySidebar(false);
  };

  return (
    <SidebarContext.Provider
      value={{
        showSecondarySidebar,
        closeSecondarySidebar,
        openSecondarySidebar,
        secondarySidebarTitle,
        secondarySidebarItems,
        isManualToggle,
        setManualToggle
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}; 