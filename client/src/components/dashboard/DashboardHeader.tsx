// src/components/dashboard/DashboardHeader.tsx
import { X, Menu } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function DashboardHeader({
  title,
  isMobileMenuOpen,
  setIsMobileMenuOpen,

}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 mr-2 rounded-md lg:hidden text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">{title}</h1>
        </div>

      </div>
    </header>
  );
}