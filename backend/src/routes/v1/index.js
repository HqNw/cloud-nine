import { Router } from 'express';
import lessonsRouter from './lessons/index.js';
// ...existing code for other route imports...

const router = Router();

// Register routes - lessons router added at the top
router.use('/', lessonsRouter);
// ...existing code for other route registrations...

export default router;
