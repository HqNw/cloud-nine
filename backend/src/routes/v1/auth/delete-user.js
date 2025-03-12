import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../../../middlewares/authMiddleware.js';

const prisma = new PrismaClient();
const delete_user_router = Router();

delete_user_router.delete('/users/:id', authenticate, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Only allow users to delete their own account unless they're an admin
    if (req.user.id !== userId && req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Delete user's lesson access first
    await prisma.userLesson.deleteMany({
      where: { userId }
    });

    // For teachers, reassign or delete their lessons
    if (req.user.role === 'TEACHER') {
      // Delete lessons created by this teacher
      await prisma.lesson.deleteMany({
        where: { teacherId: userId }
      });
    }
    
    // Delete user
    await prisma.user.delete({
      where: { id: userId }
    });
    
    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default delete_user_router;
