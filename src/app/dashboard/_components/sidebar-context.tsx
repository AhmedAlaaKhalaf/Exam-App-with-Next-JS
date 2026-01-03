"use client";
import { createContext, useContext, ReactNode } from "react";

interface SidebarContextType {
  onClose: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <SidebarContext.Provider value={{ onClose }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    return { onClose: () => {} }; // Default no-op if context not available
  }
  return context;
}

