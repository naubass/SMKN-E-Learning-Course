import express from 'express';
import { register, login, getCurrentUser, logout } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/current-user", verifyToken, getCurrentUser);
router.post('/logout', verifyToken, logout);

export default router;