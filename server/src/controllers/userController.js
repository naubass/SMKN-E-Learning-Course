import bcrypt from 'bcryptjs';
import prisma from "../utils/prisma.js";

// Field yang dikirim ke frontend 
const SAFE_USER_FIELDS = {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
};

// GET User
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: SAFE_USER_FIELDS,
            orderBy: { name: 'asc' },
        });

        return res.status(200).json({ message: 'Success', data: users });
    } catch (error) {
        console.log('Get all user error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
}

// GET Detail user 
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id },
            select: SAFE_USER_FIELDS,
        });

        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        return res.status(200).json({ message: 'Success', data: user });
    } catch (error) {
        console.log('Get user by id error:', error); 
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
}

// CREATE User Hanya ADMIN yang bisa 
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if ( !name || !email || !password || !role ) {
            return res.status(400).json({ message: 'Semua field wajib diisi' });
        }

        // Hanya ADMIN yang bisa membuat user
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Kamu tidak punya akses untuk membuat user' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        // hash password sebelum simpan, jangan simpan mentah
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
            select: SAFE_USER_FIELDS,
        });

        return res.status(201).json({ message: 'User berhasil dibuat', user });
    } catch (error) {
        console.log('Create user error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
}

// UPDATE User 
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;

        // FIX: hanya ADMIN yang boleh update, dicek di awal sebelum query lain
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Kamu tidak punya akses untuk mengupdate user' });
        }

        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        if (email && email !== existingUser.email) {
            const emailTaken = await prisma.user.findUnique({ where: { email } });
            if (emailTaken) {
                return res.status(400).json({ message: 'Email sudah terdaftar' });
            }
        }

        const dataToUpdate = {
            name: name ?? existingUser.name,
            email: email ?? existingUser.email,
            role: role ?? existingUser.role,
        };

        if (password) {
            dataToUpdate.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id },
            data: dataToUpdate,
            select: SAFE_USER_FIELDS,
        });

        return res.status(200).json({ message: 'User berhasil diupdate', user });
    } catch (error) {
        console.log('Update user error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
}

// DELETE User 
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Kamu tidak punya akses untuk menghapus user' });
        }

        // FIX: cegah admin menghapus akunnya sendiri (bisa kekunci akses)
        if (id === req.user.id) {
            return res.status(400).json({ message: 'Kamu tidak bisa menghapus akun sendiri' });
        }

        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        await prisma.user.delete({ where: { id } });

        return res.status(200).json({ message: 'User berhasil dihapus' });
    } catch (error) {
        console.log('Delete user error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
}