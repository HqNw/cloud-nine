"use client"

// src/pages/teacher/dashboard.tsx
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { VideoPlayer } from "@/components/dashboard/VideoPlayer"
import { LessonGrid } from "@/components/dashboard/LessonGrid"
import { LessonUploadForm } from "@/components/dashboard/LessonUploadForm"
import { AnimatedModal } from "@/components/ui/modal"
import api from "@/lib/api"
import { toast } from "sonner"

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

export default function TeacherDashboard() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [showUploadForm, setShowUploadForm] = useState(false)

  const fetchLessons = async () => {
    setLoading(true)
    try {
      const res = await api.get("/v1/lessons/teacher")

      // await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedLessons = res.data.lessons.map((lesson: Lesson) => ({
        ...lesson,
        videoUrl: lesson.videoUrl ? "/api/v1/lessons/student/watch/" + lesson.videoUrl : null,
      }))
      setLessons(updatedLessons || [])
      setLoading(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setLoading(false)
      if (error.response && error.response.status === 401) {
        toast.error(error.response.data.message || "Authentication required")
      } else if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "Bad request")
      } else {
        toast.error("Failed to fetch lessons")
        console.error("Error fetching lessons:", error)
      }
    }
  }

  const deleteLesson = async (id: string) => {
    try {
      await api.delete(`/v1/lessons/teacher/${id}`)
      setLessons(lessons.filter((lesson) => lesson.id !== id))
      toast.success("Lesson deleted successfully")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Failed to delete lesson")
      console.error("Error deleting lesson:", error)
    }
  }

  const playLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson)
  }

  const closeVideoPlayer = () => {
    setCurrentLesson(null)
  }

  const handleUploadSuccess = () => {
    setShowUploadForm(false)
    fetchLessons() // Refresh the lesson list
  }

  useEffect(() => {
    fetchLessons()
  }, [])

  return (
    <DashboardLayout title="Available Lessons"  setShowUploadForm={setShowUploadForm}>
      <LessonGrid
        title="Browse Lessons"
        lessons={lessons}
        loading={loading}
        isTeacher={true}
        onPlay={playLesson}
        onDelete={deleteLesson}
        emptyMessage="No lessons available yet"
      />

      {/* Video player modal */}
      {currentLesson && <VideoPlayer lesson={currentLesson} onClose={closeVideoPlayer} />}

      {/* Upload form modal with animations */}
      <AnimatedModal isOpen={showUploadForm} onClose={() => { setShowUploadForm(false); fetchLessons(); }} title="Upload New Lesson">
        <LessonUploadForm onLessonUploaded={handleUploadSuccess} />
      </AnimatedModal>
    </DashboardLayout>
  )
}

