import express from 'express';
import {
    createSubmission,
    getSubmissionByCourse,
    submitEntry,
    getEntriesForReview,
    reviewEntry,
} from '../controllers/submissionController.js';
import { verifyToken, requireRole } from '../middlewares/verifyToken.js';

const router = express.Router();

// Nested di bawah course
router.post('/courses/:courseId/submission', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), createSubmission);
router.get('/courses/:courseId/submission', verifyToken, getSubmissionByCourse);

// Kirim tugas (student)
router.post('/submissions/:submissionId/entries', verifyToken, submitEntry);

// Review tugas (instructor/admin)
router.get('/submissions/:submissionId/entries', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), getEntriesForReview);
router.patch('/entries/:entryId/review', verifyToken, requireRole('INSTRUCTOR', 'ADMIN'), reviewEntry);

export default router;