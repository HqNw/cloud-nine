"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Upload, X, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import api from "@/lib/api"
import { motion } from "framer-motion"

interface NewLesson {
  title: string
  description: string
}

interface LessonUploadFormProps {
  onLessonUploaded: () => void
}

export function LessonUploadForm({ onLessonUploaded }: LessonUploadFormProps) {
  const [newLesson, setNewLesson] = useState<NewLesson>({ title: "", description: "" })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    const MAX_FILE_SIZE = 1024 * 1024 * 1024 // 1GB in bytes

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File is too large. Maximum size is 1GB.`)
      return false
    }

    // Check if file is a video
    const validTypes = ["video/mp4", "video/webm", "video/quicktime"]
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid video file (MP4, WebM, or MOV).")
      return false
    }

    return true
  }

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }
    handleFileSelect(e.target.files[0])
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const removeSelectedFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle file upload as a two-step process
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a video file to upload")
      return
    }

    if (!newLesson.title.trim()) {
      toast.error("Please enter a lesson title")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Step 1: Create lesson metadata first
      const lessonMetadata = {
        title: newLesson.title,
        description: newLesson.description || null,
        content: "Uploaded content", // Add default content or make this a field in your form
      }

      // Create the lesson first
      const createResponse = await api.post("/v1/lessons/teacher", lessonMetadata)

      // Get the lesson ID from the response
      const createdLesson = createResponse.data.lesson
      const lessonId = createdLesson.id

      if (!lessonId) {
        throw new Error("Failed to get lesson ID from server response")
      }

      // Step 2: Upload the video file to the created lesson
      const formData = new FormData()
      formData.append("file", selectedFile)

      const uploadResponse = await api.post(`/v1/lessons/teacher/upload/${lessonId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0
          setUploadProgress(percentCompleted)
        },
      })

      if (uploadResponse.status !== 200) {
        throw new Error("Failed to upload video file")
      }

      toast.success("Lesson uploaded successfully", { richColors: true })

      // Reset form
      setNewLesson({ title: "", description: "" })
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Call the callback to refresh lessons
      onLessonUploaded()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error uploading lesson:", error)

      if (error.response && error.response.status === 401) {
        toast.error("Authentication required. Please log in again.")
      } else if (error.response && error.response.status === 413) {
        toast.error("File is too large. Maximum size is 500MB.")
      } else if (error.response && error.response.data.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Failed to upload lesson. Please try again.")
      }
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // Format file size to human-readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Form fields */}
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Lesson Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            placeholder="Enter lesson title"
            value={newLesson.title}
            onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
            className="bg-zinc-50 dark:bg-zinc-700/50 border-zinc-200 dark:border-zinc-600"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Description (optional)
          </label>
          <Textarea
            id="description"
            placeholder="Enter lesson description"
            value={newLesson.description}
            onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
            className="bg-zinc-50 dark:bg-zinc-700/50 border-zinc-200 dark:border-zinc-600 resize-none min-h-[80px]"
          />
        </div>
      </div>

      {/* File upload area */}
      <div
        className={`mt-4 border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-zinc-300 dark:border-zinc-600 hover:border-primary dark:hover:border-primary"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={handleFileChange}
        />

        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <FileText className="h-8 w-8 text-zinc-500 dark:text-zinc-400 mr-3" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{selectedFile.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{formatFileSize(selectedFile.size)}</p>
              </div>
              <button
                onClick={removeSelectedFile}
                className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"
              >
                <X className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              </button>
            </div>

            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-700 dark:hover:bg-zinc-600 text-white font-medium py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-300 h-11 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    <span className="text-base text-white">
                    Uploading... {/* Uploading... {uploadProgress > 0 ? `${uploadProgress}%` : ""} */}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Upload className="mr-2 h-5 w-5 text-white" />
                    <span className="text-base text-white">Upload Lesson</span>
                  </div>
                )}
              </button>
            </motion.div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800">
              <Upload className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Drag and drop your video file here</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">MP4, WebM, or MOV (max. 1GB)</p>
            </div>
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="mt-2">
              Select File
            </Button>
          </div>
        )}
      </div>

      {/* Upload progress bar */}
      {isUploading && uploadProgress > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-zinc-800 dark:bg-zinc-400 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Warning message */}
      <div className="mt-4 flex items-start p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-lg text-sm">
        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
        <p>
          Please ensure your video is appropriate for educational purposes. Large files may take some time to upload
          depending on your internet connection.
        </p>
      </div>
    </div>
  )
}

