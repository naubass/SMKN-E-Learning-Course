import express from 'express';
import {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
} from '../controllers/courseController.js';
import { verifyToken, requireRole } from '../middlewares/verifyToken.js';

const router = express.Router();

// Public routes (untuk landing page & detail course)
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes (instructor & admin only)
router.post('/', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), createCourse);
router.put('/:id', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), updateCourse);
router.delete('/:id', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), deleteCourse);

export default router;