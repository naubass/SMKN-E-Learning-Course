import express from 'express';
import { uploadImage } from '../middlewares/upload.js';
import { handleImageUpload } from '../controllers/uploadController.js';
import { verifyToken, requireRole } from '../middlewares/verifyToken.js';
import { multerErrorHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

router.post(
    '/image',
    verifyToken,
    requireRole('INSTRUCTOR', 'ADMIN'),
    uploadImage.single('image'),
    multerErrorHandler,
    handleImageUpload
);

export default router;