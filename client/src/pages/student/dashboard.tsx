// src/pages/student/dashboard.tsx
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LessonGrid } from "@/components/dashboard/LessonGrid";
import { VideoPlayer } from "@/components/dashboard/VideoPlayer";
import api from "@/lib/api";
import { toast } from "sonner";

interface Teacher {
  id: string;
  name: string;
  email: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  content: string;
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  teacherId: string;
  teacher: Teacher;
}

export default function StudentDashboard() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await api.get("/v1/lessons/student");
      const updatedLessons = res.data.lessons.map((lesson: Lesson) => ({
        ...lesson,
        videoUrl: lesson.videoUrl ? "/api/v1/lessons/student/watch/" + lesson.videoUrl : null,
      }));
      setLessons(updatedLessons || []);
      setLoading(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setLoading(false);
      if (error.response && error.response.status === 401) {
        toast.error(error.response.data.message || "Authentication required");
      } else if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "Bad request");
      } else {
        toast.error("Failed to fetch lessons");
        console.error("Error fetching lessons:", error);
      }
    }
  };

  const playLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const closeVideoPlayer = () => {
    setCurrentLesson(null);
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  return (

    <DashboardLayout title="Available Lessons">
      <LessonGrid
        title="Browse Lessons"
        lessons={lessons}
        loading={loading}
        isTeacher={false}
        onPlay={playLesson}
        emptyMessage="No lessons available yet"
      />

      {/* Video player modal */}
      {currentLesson && (
        <VideoPlayer lesson={currentLesson} onClose={closeVideoPlayer} />
      )}
    </DashboardLayout>
  );
}