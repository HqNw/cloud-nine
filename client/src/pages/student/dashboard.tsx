"use client"

import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import {
  Play,
  Clock,
  BookOpen,
  User,
  LogOut,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Heart,
  Share2,
  BookmarkPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Mock data for lessons
const initialLessons = [
  {
    id: "1",
    title: "Introduction to Mathematics",
    description: "Basic concepts and fundamentals of mathematics",
    thumbnail:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    duration: "45:30",
    teacher: "Prof. Sarah Johnson",
    subject: "Mathematics",
    level: "Beginner",
    videoUrl: "https://example.com/video1.mp4",
  },
  {
    id: "2",
    title: "Advanced Physics Concepts",
    description: "Exploring complex physics theories and applications",
    thumbnail:
      "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    duration: "52:15",
    teacher: "Dr. Michael Chen",
    subject: "Physics",
    level: "Advanced",
    videoUrl: "https://example.com/video2.mp4",
  },
  {
    id: "3",
    title: "Chemistry Fundamentals",
    description: "Understanding the basics of chemical reactions and elements",
    thumbnail:
      "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    duration: "38:45",
    teacher: "Dr. Emily Rodriguez",
    subject: "Chemistry",
    level: "Intermediate",
    videoUrl: "https://example.com/video3.mp4",
  },
  {
    id: "4",
    title: "Biology and Ecosystems",
    description: "Exploring the interconnections between living organisms and their environments",
    thumbnail:
      "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    duration: "41:20",
    teacher: "Prof. James Wilson",
    subject: "Biology",
    level: "Intermediate",
    videoUrl: "https://example.com/video4.mp4",
  },
  {
    id: "5",
    title: "World History: Ancient Civilizations",
    description: "Journey through the rise and fall of ancient civilizations",
    thumbnail:
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    duration: "56:10",
    teacher: "Dr. Amara Patel",
    subject: "History",
    level: "Beginner",
    videoUrl: "https://example.com/video5.mp4",
  },
  {
    id: "6",
    title: "Introduction to Computer Science",
    description: "Learn the fundamentals of programming and computer systems",
    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    duration: "49:25",
    teacher: "Prof. David Kim",
    subject: "Computer Science",
    level: "Beginner",
    videoUrl: "https://example.com/video6.mp4",
  },
]

// Categories for filtering
const categories = ["All Subjects", "Mathematics", "Physics", "Chemistry", "Biology", "History", "Computer Science"]

export default function StudentDashboard() {
  const [lessons, setLessons] = useState(initialLessons)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Subjects")
  const [currentLesson, setCurrentLesson] = useState<(typeof initialLessons)[0] | null>(null)
  const [theme, setTheme] = useState<"light" | "dark">(
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  )
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(newTheme)
  }

  // Filter lessons based on search query and category
  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.teacher.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "All Subjects" || lesson.subject === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Handle playing a lesson
  const playLesson = (lesson: (typeof initialLessons)[0]) => {
    setCurrentLesson(lesson)
    // In a real app, you would load the video and start playing
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch((e) => console.log("Autoplay prevented:", e))
      }
    }, 100)
  }

  // Close video player
  const closeVideoPlayer = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    setCurrentLesson(null)
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
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Student Portal</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Access your lessons</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <a
              href="#"
              className="flex items-center p-2 rounded-md bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
            >
              <Play className="w-5 h-5 mr-3" />
              <span>Lessons</span>
            </a>
            <a
              href="#"
              className="flex items-center p-2 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <Clock className="w-5 h-5 mr-3" />
              <span>Recently Watched</span>
            </a>
            <a
              href="#"
              className="flex items-center p-2 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <BookOpen className="w-5 h-5 mr-3" />
              <span>My Courses</span>
            </a>
            <a
              href="#"
              className="flex items-center p-2 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <User className="w-5 h-5 mr-3" />
              <span>Profile</span>
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
              <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Available Lessons</h1>
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
          {/* Categories */}
          <div className="mb-6 overflow-x-auto pb-2">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-zinc-800 dark:bg-zinc-600 text-white"
                      : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Lessons grid */}
          <h2 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
            {selectedCategory === "All Subjects" ? "All Lessons" : selectedCategory} ({filteredLessons.length})
          </h2>

          {filteredLessons.length === 0 ? (
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-8 text-center border border-zinc-200 dark:border-zinc-700">
              <BookOpen className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-500 mb-4" />
              <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-100 mb-2">No lessons found</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Try a different search term or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-white dark:bg-zinc-800 rounded-lg shadow overflow-hidden border border-zinc-200 dark:border-zinc-700 flex flex-col"
                >
                  <div
                    className="relative h-48 bg-zinc-200 dark:bg-zinc-700 group cursor-pointer"
                    onClick={() => playLesson(lesson)}
                  >
                    <img
                      src={lesson.thumbnail || "/placeholder.svg"}
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {lesson.duration}
                    </div>
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1">{lesson.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">{lesson.description}</p>
                    <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                      <span className="bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded mr-2">{lesson.level}</span>
                      <span>{lesson.subject}</span>
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Instructor: {lesson.teacher}</div>
                  </div>
                  <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
                    <Button
                      className="w-full bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white"
                      onClick={() => playLesson(lesson)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Watch Lesson
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Video player modal */}
      {currentLesson && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
            <div className="relative bg-black aspect-video">
              <video ref={videoRef} className="w-full h-full" controls poster={currentLesson.thumbnail}>
                <source src={currentLesson.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button
                onClick={closeVideoPlayer}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">{currentLesson.title}</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-4">{currentLesson.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Instructor: {currentLesson.teacher} • {currentLesson.duration} • {currentLesson.subject}
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                    <BookmarkPlus className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

