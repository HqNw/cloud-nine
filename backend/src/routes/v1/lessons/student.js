import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, hasRole } from '../../../middlewares/authMiddleware.js';
import { LessonService } from '../../../services/lessonService.js';
import fs from "fs";
import path from 'path';


const prisma = new PrismaClient();
const student_lessons_router = Router();

const lessonService = new LessonService();

// Middleware to ensure only students can access these routes
const studentAuth = [authenticate, hasRole(['STUDENT'])];

// Get all lessons the student has access to
student_lessons_router.get('/', studentAuth, async (req, res) => {
  try {
    const userLessons = await lessonService.getAllLessons();
    const lessons = userLessons.map(ul => ({
      ...ul,
      teacher: {
        id: ul.teacher.id,
        name: ul.teacher.name,
        email: ul.teacher.email
      }
    }));
    // const lessons = userLessons.map(ul => ({
    //   ...ul.lesson,
    //   watched: ul.watched
    // }));

    res.status(200).json({ lessons });
  } catch (error) {
    console.error('Get student lessons error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific lesson by ID
student_lessons_router.get('/:id', studentAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if student has access to the lesson
    const userLesson = await prisma.userLesson.findUnique({
      where: {
        userId_lessonId: {
          userId: req.user.id,
          lessonId: id
        }
      },
      include: {
        lesson: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    if (!userLesson) {
      return res.status(404).json({ message: 'Lesson not found or you do not have access' });
    }
    
    const lesson = {
      ...userLesson.lesson,
      watched: userLesson.watched
    };
    
    res.status(200).json({ lesson });
  } catch (error) {
    console.error('Get student lesson error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Mark lesson as watched
student_lessons_router.put('/:id/watch', studentAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if student has access to the lesson
    const userLesson = await prisma.userLesson.findUnique({
      where: {
        userId_lessonId: {
          userId: req.user.id,
          lessonId: id
        }
      }
    });
    
    if (!userLesson) {
      return res.status(404).json({ message: 'Lesson not found or you do not have access' });
    }
    
    // Update watched status
    await prisma.userLesson.update({
      where: {
        userId_lessonId: {
          userId: req.user.id,
          lessonId: id
        }
      },
      data: { watched: true }
    });
    
    res.status(200).json({ message: 'Lesson marked as watched' });
  } catch (error) {
    console.error('Mark lesson as watched error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Mark lesson as unwatched
student_lessons_router.put('/:id/unwatch', studentAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if student has access to the lesson
    const userLesson = await prisma.userLesson.findUnique({
      where: {
        userId_lessonId: {
          userId: req.user.id,
          lessonId: id
        }
      }
    });
    
    if (!userLesson) {
      return res.status(404).json({ message: 'Lesson not found or you do not have access' });
    }
    
    // Update watched status
    await prisma.userLesson.update({
      where: {
        userId_lessonId: {
          userId: req.user.id,
          lessonId: id
        }
      },
      data: { watched: false }
    });
    
    res.status(200).json({ message: 'Lesson marked as unwatched' });
  } catch (error) {
    console.error('Mark lesson as unwatched error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


student_lessons_router.get("/watch/:filename", async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(path.resolve('uploads'), filename);
  try {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const headers = {
        'Content-Type': 'video/mp4',
        'Content-Length': chunkSize,
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
      };
      res.status(206).set(headers);
      file.pipe(res);
    } else {
      const headers = {
        'Content-Type': 'video/mp4',
        'Content-Length': fileSize,
        'Accept-Ranges': 'bytes',
      };
      res.status(200).set(headers);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});


export default student_lessons_router;
