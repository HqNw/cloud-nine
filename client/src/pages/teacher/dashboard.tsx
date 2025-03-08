"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { Upload, Video, Edit, Trash2, LogOut, Search, Plus, Moon, Sun, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Mock data for lessons
const initialLessons = [
  {
    id: "1",
    title: "Introduction to Mathematics",
    description: "Basic concepts and fundamentals of mathematics",
    thumbnail:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    duration: "45:30",
    uploadDate: "2023-10-15",
    views: 128,
  },
  {
    id: "2",
    title: "Advanced Physics Concepts",
    description: "Exploring complex physics theories and applications",
    thumbnail:
      "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    duration: "52:15",
    uploadDate: "2023-10-20",
    views: 95,
  },
  {
    id: "3",
    title: "Chemistry Fundamentals",
    description: "Understanding the basics of chemical reactions and elements",
    thumbnail:
      "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    duration: "38:45",
    uploadDate: "2023-10-25",
    views: 112,
  },
]

export default function TeacherDashboard() {
  const [lessons, setLessons] = useState(initialLessons)
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [newLesson, setNewLesson] = useState({ title: "", description: "" })
  const [theme, setTheme] = useState<"light" | "dark">(
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  )
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(newTheme)
  }

  // Filter lessons based on search query
  const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true)

      // Simulate upload process
      setTimeout(() => {
        const file = e.target.files![0]
        const newId = (lessons.length + 1).toString()
        const now = new Date()

        const newLessonItem = {
          id: newId,
          title: newLesson.title || `Lesson ${newId}`,
          description: newLesson.description || "No description provided",
          thumbnail:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
          duration: "00:00", // Would be extracted from the actual video
          uploadDate: now.toISOString().split("T")[0],
          views: 0,
        }

        setLessons([...lessons, newLessonItem])
        setIsUploading(false)
        setNewLesson({ title: "", description: "" })

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }, 2000)
    }
  }

  // Delete a lesson
  const deleteLesson = (id: string) => {
    setLessons(lessons.filter((lesson) => lesson.id !== id))
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 transition-colors duration-300">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 transition-all duration-300 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Teacher Portal</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your lessons</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <a
              href="#"
              className="flex items-center p-2 rounded-md bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
            >
              <Video className="w-5 h-5 mr-3" />
              <span>Lessons</span>
            </a>
            <a
              href="#"
              className="flex items-center p-2 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <Upload className="w-5 h-5 mr-3" />
              <span>Uploads</span>
            </a>
            <a
              href="#"
              className="flex items-center p-2 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <Edit className="w-5 h-5 mr-3" />
              <span>Edit Profile</span>
            </a>
          </nav>

          <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
            <button
              onClick={toggleTheme}
              className="flex items-center p-2 w-full rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              {theme === "light" ? <Moon className="w-5 h-5 mr-3" /> : <Sun className="w-5 h-5 mr-3" />}
              <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </button>
            <Link
              to="/"
              className="flex items-center p-2 mt-2 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 mr-2 rounded-md lg:hidden text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">My Lessons</h1>
            </div>

            <div className="relative w-full max-w-xs ml-4">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
                size={18}
              />
              <Input
                type="search"
                placeholder="Search lessons..."
                className="pl-10 bg-zinc-50 dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Upload section */}
          <div className="mb-8 bg-white dark:bg-zinc-800 rounded-lg shadow p-6 border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">Upload New Lesson</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="lesson-title" className="text-zinc-700 dark:text-zinc-300">
                  Lesson Title
                </Label>
                <Input
                  id="lesson-title"
                  placeholder="Enter lesson title"
                  className="bg-zinc-50 dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="lesson-description" className="text-zinc-700 dark:text-zinc-300">
                  Description
                </Label>
                <textarea
                  id="lesson-description"
                  rows={3}
                  placeholder="Enter lesson description"
                  className="w-full px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                  value={newLesson.description}
                  onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="video-upload" className="text-zinc-700 dark:text-zinc-300">
                  Video File
                </Label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    id="video-upload"
                    ref={fileInputRef}
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white"
                  >
                    {isUploading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Select Video
                      </>
                    )}
                  </Button>
                  <span className="ml-3 text-sm text-zinc-500 dark:text-zinc-400">
                    {isUploading ? "Processing upload..." : "MP4, WebM or MOV. Max 500MB."}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lessons grid */}
          <h2 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
            Your Lessons ({filteredLessons.length})
          </h2>

          {filteredLessons.length === 0 ? (
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-8 text-center border border-zinc-200 dark:border-zinc-700">
              <Video className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-500 mb-4" />
              <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-100 mb-2">No lessons found</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                {searchQuery ? "Try a different search term" : "Upload your first lesson to get started"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Lesson
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-white dark:bg-zinc-800 rounded-lg shadow overflow-hidden border border-zinc-200 dark:border-zinc-700 flex flex-col"
                >
                  <div className="relative h-48 bg-zinc-200 dark:bg-zinc-700">
                    <img
                      src={lesson.thumbnail || "/placeholder.svg"}
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {lesson.duration}
                    </div>
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1">{lesson.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">{lesson.description}</p>
                    <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                      <span>Uploaded: {lesson.uploadDate}</span>
                      <span>{lesson.views} views</span>
                    </div>
                  </div>
                  <div className="p-4 border-t border-zinc-200 dark:border-zinc-700 flex justify-between">
                    <Button
                      variant="outline"
                      className="text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 dark:text-red-400 border-zinc-200 dark:border-zinc-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => deleteLesson(lesson.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

