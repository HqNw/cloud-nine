"use client"

import { type ReactNode, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface AnimatedModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export function AnimatedModal({ isOpen, onClose, children, title }: AnimatedModalProps) {
  // Create a ref for the modal content
  const modalRef = useRef<HTMLDivElement>(null)

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscapeKey)
    return () => window.removeEventListener("keydown", handleEscapeKey)
  }, [isOpen, onClose])

  // Handle clicking outside using a global click listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    // Add the event listener when the modal is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal content */}
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <motion.div
              ref={modalRef}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 p-6 text-left align-middle shadow-xl relative z-10"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                },
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
                y: 20,
                transition: {
                  duration: 0.2,
                },
              }}
            >
              {/* Header with title and close button */}
              {title && (
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-700">
                  <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">{title}</h3>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* Modal body */}
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

