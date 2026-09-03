import express from 'express';
import {
    createLesson,
    getLessonsByChapter,
    getLessonById,
    updateLesson,
    deleteLesson,
} from '../controllers/lessonController.js';
import { verifyToken, requireRole } from '../middlewares/verifyToken.js';

const router = express.Router();

// Nested di bawah chapter: /api/chapters/:chapterId/lessons
router.get('/chapters/:chapterId/lessons', getLessonsByChapter);
router.post('/chapters/:chapterId/lessons', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), createLesson);
 
// Langsung by lesson id: /api/lessons/:id
router.get('/lessons/:id', getLessonById);
router.put('/lessons/:id', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), updateLesson);
router.delete('/lessons/:id', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), deleteLesson);

export default router;