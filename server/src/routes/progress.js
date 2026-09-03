import express from 'express';
import {
    markLessonProgress,
    getCourseProgress,
    getMyProgressForCourse,
} from '../controllers/progressController.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

// Semua route progress wajib login (siapa saja yang login boleh tracking progressnya sendiri)
router.patch('/lessons/:lessonId/progress', verifyToken, markLessonProgress);
router.get('/courses/:courseId/progress', verifyToken, getCourseProgress);
router.get('/courses/:courseId/progress/lessons', verifyToken, getMyProgressForCourse);

export default router;