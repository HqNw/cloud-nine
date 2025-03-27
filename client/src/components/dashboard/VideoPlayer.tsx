// src/components/dashboard/VideoPlayer.tsx
import { useRef } from "react";
import { X, Heart, BookmarkPlus, Share2 } from "lucide-react";

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

interface VideoPlayerProps {
  lesson: Lesson | null;
  onClose: () => void;
}

export function VideoPlayer({ lesson, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!lesson) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
        <div className="relative bg-black aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            controlsList="nodownload"
            disablePictureInPicture
            poster={"https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"}
            autoPlay
            onContextMenu={(e) => e.preventDefault()}

          >
            <source src={lesson.videoUrl || ""} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">{lesson.title}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-4">{lesson.description}</p>
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Instructor: {lesson.teacher.name} • {lesson.content}
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
  );
}