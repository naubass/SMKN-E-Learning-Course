import express from 'express';
import {
    createQuiz,
    getQuizByLesson,
    submitQuiz,
    getMyQuizResult,
    deleteQuiz,
} from '../controllers/quizController.js';
import { verifyToken, requireRole } from '../middlewares/verifyToken.js';

const router = express.Router();

// Nested di bawah lesson
router.post('/lessons/:lessonId/quiz', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), createQuiz);
router.get('/lessons/:lessonId/quiz', verifyToken, getQuizByLesson);

// By quiz id
router.post('/quizzes/:quizId/submit', verifyToken, submitQuiz);
router.get('/quizzes/:quizId/my-result', verifyToken, getMyQuizResult);
router.delete('/quizzes/:quizId', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), deleteQuiz);

export default router;