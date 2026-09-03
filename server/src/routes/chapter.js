import express from 'express';
import {
    createChapter,
    getChaptersByCourse,
    updateChapter,
    deleteChapter,
} from '../controllers/chapterController.js';
import { verifyToken, requireRole } from '../middlewares/verifyToken.js';

const router = express.Router();

// Nested di bawah course: /api/courses/:courseId/chapters
router.get('/courses/:courseId/chapters', getChaptersByCourse);
router.post('/courses/:courseId/chapters', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), createChapter);

// Langsung by chapter id: /api/chapters/:id
router.put('/chapters/:id', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), updateChapter);
router.delete('/chapters/:id', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), deleteChapter);

export default router; 