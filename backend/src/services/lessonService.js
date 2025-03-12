import { PrismaClient } from '@prisma/client';
import bycrypt from 'bcrypt';
import fs from 'fs';
import { console } from 'inspector';
import path from 'path';

const prisma = new PrismaClient();

class LessonService {
  async createLesson(
    title,
    content,
    teacherId,
    description
  ) {
    return prisma.lesson.create({
      data: {
        title,
        content,
        description,
        teacherId,
      },
    });
  }

  async getLessonById(id) {
    return prisma.lesson.findUnique({
      where: { id },
      include: { teacher: true, students: true },
    });
  }

  async getAllLessons() {
    return prisma.lesson.findMany({
      include: { teacher: true },
    });
  }

  async getLessonsByTeacherId(teacherId) {
    return prisma.lesson.findMany({
      where: { teacherId },
      include: { teacher: true },
    });
  }

  async updateLesson(id, data) {
    return prisma.lesson.update({
      where: { id },
      data,
    });
  }

  async deleteLesson(id) {
    return prisma.lesson.delete({
      where: { id },
    });
  }

  async assignLessonToUser(lessonId, userId) {
    await prisma.userLesson.create({
      data: {
        lessonId,
        userId,
      },
    });
  }

  async markLessonAsWatched(
    lessonId,
    userId,
    watched = true
  ) {
    await prisma.userLesson.update({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      data: {
        watched,
      },
    });
  }

  async getUserLessons(userId) {
    return prisma.userLesson.findMany({
      where: { userId },
      include: { lesson: true },
    });
  }

  async uploadLessonFile(lessonId, file) {
    const fileExtension = await path.extname(file.name) || '.mp4';
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(7);
    const VideoName = randomString + "_" + timestamp + fileExtension;

    const VideoDirectory = path.resolve('uploads');
    if (!fs.existsSync(VideoDirectory)) {
      fs.mkdirSync(VideoDirectory);
    }
    const VideoPath = path.join(VideoDirectory, VideoName);
    console.log(VideoPath);
    file.mv(VideoPath);

    return prisma.lesson.update({
      data: {
        videoUrl: VideoName,
      },
      where: { id: lessonId },
    });
  }
}



export { LessonService };
