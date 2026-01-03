"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import SidebarClient from "./sidebar-client";
import { SidebarProvider } from "./sidebar-context";

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <SidebarProvider onClose={handleClose}>
      <div className="flex h-screen relative w-full">
        {/* Hamburger Menu Button - Mobile Only */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-md shadow-lg hover:bg-primary/90 transition-colors"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Overlay - Mobile Only */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={handleClose}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static w-3/4 max-w-sm lg:w-1/4 h-screen bg-blue-50 z-40
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <SidebarClient />
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-3/4 overflow-y-auto flex flex-col pt-16 lg:pt-0 min-h-0">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

