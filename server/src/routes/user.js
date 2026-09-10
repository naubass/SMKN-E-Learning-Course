import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from '../controllers/userController.js';
import { verifyToken, requireRole } from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, requireRole('ADMIN'), getAllUsers);
router.post('/', verifyToken, requireRole('ADMIN'), createUser);
router.put('/:id', verifyToken, requireRole('ADMIN'), updateUser);
router.delete('/:id', verifyToken, requireRole('ADMIN'), deleteUser);
router.get('/:id', verifyToken, getUserById);

export default router;