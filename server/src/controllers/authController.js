import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { isValidEmail, validatePassword } from '../utils/validators.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

// Register Method
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validasi username, email, dan password
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password wajib diisi' });
        }

        // Validasi email
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Email tidak valid' });
        }

        // Validasi kekuatan password
        const passwordCheck = validatePassword(password);
        if (!passwordCheck.isValid) {
        return res.status(400).json({
            message: 'Password tidak memenuhi syarat',
            errors: passwordCheck.errors,
        });
        }

        // check unik email
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        // Hashing Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'STUDENT',
            },
        });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        const { password: _, ...userWithoutPassword } = user;

        return res.status(201).json({ message: 'User berhasil dibuat', token, user: userWithoutPassword });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
}

// Login Method
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validasi email dan password
        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password wajib diisi' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({ message: 'Login berhasil', token, user: userWithoutPassword });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
}

// GET data user yang sedang login
const getCurrentUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ 
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            } 
        });

        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
}

const logout = async (req, res) => {
    try {
        // Kalau nanti pakai httpOnly cookie untuk simpan token, hapus di sini:
        // res.clearCookie('token');
 
        return res.status(200).json({ message: 'Logout berhasil' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};
 
export { register, login, getCurrentUser, logout };