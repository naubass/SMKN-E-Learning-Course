import prisma from "../utils/prisma";

// GET User
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
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
        const user = await prisma.user.findUnique({ where: { id } });

        // Kondisi jika user tidak ditemukan
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

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        // Hanya ADMIN yang bisa membuat user
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Kamu tidak punya akses untuk membuat user' });
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
                role,
            }
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

        if ( !name || !email || !password || !role ) {
            return res.status(400).json({ message: 'Semua field wajib diisi' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser && existingUser.id !== id) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        // Hanya ADMIN yang bisa mengupdate user
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Kamu tidak punya akses untuk mengupdate user' });
        }

        const user = await prisma.user.update({
            where: { id },
            data: {
                name: name ?? existingUser.name,
                email: email ?? existingUser.email,
                password: password ?? existingUser.password,
                role: role ?? existingUser.role,
            }
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

        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        // Hanya ADMIN yang bisa menghapus user
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Kamu tidak punya akses untuk menghapus user' });
        }

        await prisma.user.delete({ where: { id } });

        return res.status(200).json({ message: 'User berhasil dihapus' });
    } catch (error) {
        console.log('Delete user error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
}