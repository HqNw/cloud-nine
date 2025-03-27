"use client"

// src/components/dashboard/DashboardLayout.tsx
import { type ReactNode, useState, useEffect } from "react"
import { useTheme } from "@/hooks/useTheme"
import { Sidebar } from "./Sidebar"
import { DashboardHeader } from "./DashboardHeader"
import { Toaster } from "sonner"
import { useUser } from "@/contexts/user-context"

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  onSearchChange?: (query: string) => void
  // showUploadForm?: boolean
  setShowUploadForm?: (show: boolean) => void
}

export function DashboardLayout({
  children,
  title = "Dashboard",
  onSearchChange,
  // showUploadForm = false,
  setShowUploadForm,
}: DashboardLayoutProps) {
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { userType } = useUser()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(searchQuery)
    }
  }, [searchQuery, onSearchChange])

  if (!userType) {
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 transition-colors duration-300">
      <Toaster position="top-right" expand={false} invert richColors closeButton />

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <Sidebar
        theme={theme}
        toggleTheme={toggleTheme}
        isMobileMenuOpen={isMobileMenuOpen}
        userType={userType}
        items={[
          {
            icon: "video",
            title: "Lessons",
            link: "/",
            foruser: null,
          },
          {
            icon: "upload",
            title: "Upload",
            foruser: "teacher",
            onClick: () => setShowUploadForm?.(true),
          },
        ]}
      />

      {/* Main content */}
      <main className="lg:ml-64 transition-all duration-300">
        <DashboardHeader
          title={title}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}

