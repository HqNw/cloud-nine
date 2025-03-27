// src/components/dashboard/LessonCard.tsx
import { Play, MoreVertical, Trash } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

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

  // TODO: future properties
  thumbnailUrl?: string;
  duration?: number;

}

interface LessonCardProps {
  lesson: Lesson;
  onPlay: (lesson: Lesson) => void;
  onDelete?: (id: string) => void;
  isTeacher?: boolean;
}

export function LessonCard({ lesson, onPlay, onDelete, isTeacher }: LessonCardProps) {
  const formattedDate = new Date(lesson.createdAt).toUTCString();
  
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      <div 
        className="aspect-video relative bg-zinc-200 dark:bg-zinc-700 cursor-pointer group" 
        onClick={() => onPlay(lesson)}
      >
        {/* Placeholder image or video thumbnail */}
        <img 
          src={lesson.thumbnailUrl || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"} 
          alt={lesson.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/60 rounded-full p-3 transform transition-transform group-hover:scale-110">
            <Play className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 line-clamp-1">
            {lesson.title}
          </h3>
          
          {isTeacher && onDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="text-red-500 dark:text-red-400 cursor-pointer"
                  onClick={() => onDelete(lesson.id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
          {lesson.description || "No description"}
        </p>
        
        <div className="flex justify-between items-center mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span>Uploaded: {formattedDate}</span>
          <span>{lesson.teacher.name}</span>
        </div>
      </div>
    </div>
  );
}