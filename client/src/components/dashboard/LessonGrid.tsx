"use client"

// src/components/dashboard/LessonGrid.tsx
import { useState } from "react"
import { LessonCard } from "@/components/dashboard/LessonCard"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Teacher {
  id: string
  name: string
  email: string
}

interface Lesson {
  id: string
  title: string
  description: string | null
  content: string
  videoUrl: string | null
  createdAt: string
  updatedAt: string
  teacherId: string
  teacher: Teacher
}

interface LessonGridProps {
  title: string
  lessons: Lesson[]
  loading: boolean
  isTeacher: boolean
  onPlay: (lesson: Lesson) => void
  onDelete?: (id: string) => void
  emptyMessage?: string
}

export function LessonGrid({
  title,
  lessons,
  loading,
  isTeacher,
  onPlay,
  onDelete,
  emptyMessage = "No lessons available yet",
}: LessonGridProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter lessons based on search query
  const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="mt-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">{title}</h2>
          
          
          <AnimatePresence>
            {loading && (lessons.length === 0) && (
              <motion.div
                className="absolute inset-0 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full border-4 border-zinc-300 dark:border-zinc-700 border-t-zinc-800 dark:border-t-zinc-300 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-zinc-800 dark:bg-zinc-300"></div>
                    </div>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 font-medium">Loading lessons...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* Non-blocking loading indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full"
              >
                <Loader2 className="h-4 w-4 text-zinc-600 dark:text-zinc-400 animate-spin" />
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Loading...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-64">
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

      {/* Lessons grid - always visible and interactive */}
      <div className="min-h-[200px]">
        {filteredLessons.length === 0 && !loading ? (
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 text-center border border-zinc-200 dark:border-zinc-700">
            <p className="text-zinc-500 dark:text-zinc-400">
              {searchQuery ? "No lessons match your search" : emptyMessage}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} onPlay={onPlay} onDelete={onDelete} isTeacher={isTeacher} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

