import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, hasRole } from '../../../middlewares/authMiddleware.js';
import { LessonService } from '../../../services/lessonService.js';
import fs from 'fs';
import fileUpload from 'express-fileupload';

const prisma = new PrismaClient();
const teacher_lessons_router = Router();

const lessonService = new LessonService();

// Middleware to ensure only teachers can access these routes
const teacherAuth = [authenticate, hasRole(['TEACHER'])];

// Get all lessons created by the teacher
teacher_lessons_router.get('/', teacherAuth, async (req, res) => {
  try {
    const lessons = await lessonService.getLessonsByTeacherId(req.user.id);
    res.status(200).json({ lessons });
  } catch (error) {
    console.error('Get teacher lessons error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new lesson
teacher_lessons_router.post('/', teacherAuth, async (req, res) => {
  try {
    const { title, description, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const newLesson = await lessonService.createLesson(
      title,
      content,
      req.user.id,
      description
    );

    res.status(201).json({
      message: 'Lesson created successfully',
      lesson: newLesson
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Upload a file to a lesson
teacher_lessons_router.post('/upload/:id', [teacherAuth, fileUpload()], async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: 'File is required' });
    }
    
    const { file } = req.files;

    // Convert lesson id to integer

    const lesson = await lessonService.getLessonById(id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (lesson.teacherId !== req.user.id) {
      return res.status(403).json({ message: 'You can only upload files to your own lessons' });
    }

    const filePath = await lessonService.uploadLessonFile(id, file);

    res.status(200).json({ message: 'File uploaded successfully', filePath });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

});
 
// Update a lesson
teacher_lessons_router.put('/:id', teacherAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content } = req.body;
    
    const lesson = await lessonService.getLessonById(id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    if (lesson.teacherId !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own lessons' });
    }
    
    const updatedLesson = await lessonService.updateLesson(id, {
      title,
      description,
      content
    });
    
    res.status(200).json({
      message: 'Lesson updated successfully',
      lesson: updatedLesson
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a lesson
teacher_lessons_router.delete('/:id', teacherAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if lesson exists and belongs to teacher
    const lesson = await prisma.lesson.findUnique({
      where: { id }
    });
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    if (lesson.teacherId !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own lessons' });
    }
    
    // Delete all student access to this lesson
    await prisma.userLesson.deleteMany({
      where: { lessonId: id }
    });
    
    // Delete the lesson
    await prisma.lesson.delete({
      where: { id }
    });
    
    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Grant student access to a lesson
teacher_lessons_router.post('/:id/access', teacherAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;
    
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }
    
    // Check if lesson exists and belongs to teacher
    const lesson = await prisma.lesson.findUnique({
      where: { id }
    });
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    if (lesson.teacherId !== req.user.id) {
      return res.status(403).json({ message: 'You can only grant access to your own lessons' });
    }
    
    // Check if student exists
    const student = await prisma.user.findUnique({
      where: { id: studentId }
    });
    
    if (!student || student.role !== 'STUDENT') {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check if access already exists
    const existingAccess = await prisma.userLesson.findUnique({
      where: {
        userId_lessonId: {
          userId: studentId,
          lessonId: id
        }
      }
    });
    
    if (existingAccess) {
      return res.status(409).json({ message: 'Student already has access to this lesson' });
    }
    
    // Grant access
    await prisma.userLesson.create({
      data: {
        userId: studentId,
        lessonId: id
      }
    });
    
    res.status(200).json({ message: 'Access granted successfully' });
  } catch (error) {
    console.error('Grant access error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Revoke student access to a lesson
teacher_lessons_router.delete('/:lessonId/access/:studentId', teacherAuth, async (req, res) => {
  try {
    const { lessonId, studentId } = req.params;
    
    // Check if lesson exists and belongs to teacher
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    if (lesson.teacherId !== req.user.id) {
      return res.status(403).json({ message: 'You can only revoke access to your own lessons' });
    }
    
    // Delete access
    await prisma.userLesson.delete({
      where: {
        userId_lessonId: {
          userId: studentId,
          lessonId: lessonId
        }
      }
    });
    
    res.status(200).json({ message: 'Access revoked successfully' });
  } catch (error) {
    console.error('Revoke access error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Access not found' });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default teacher_lessons_router;
