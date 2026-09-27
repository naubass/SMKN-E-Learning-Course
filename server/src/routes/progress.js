import express from 'express';
import {
    markLessonProgress,
    getCourseProgress,
    getMyProgressForCourse,
    getCourseStudentsProgress,
} from '../controllers/progressController.js';
import { verifyToken, requireRole } from '../middlewares/verifyToken.js';

const router = express.Router();

router.patch('/lessons/:lessonId/progress', verifyToken, markLessonProgress);
router.get('/courses/:courseId/progress', verifyToken, getCourseProgress);
router.get('/courses/:courseId/progress/lessons', verifyToken, getMyProgressForCourse);

// Khusus instructor pemilik course / admin: lihat progress SEMUA siswa
router.get(
    '/courses/:courseId/students-progress',
    verifyToken,
    requireRole('INSTRUCTOR', 'ADMIN'),
    getCourseStudentsProgress
);

export default router;