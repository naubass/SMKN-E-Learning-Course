import prisma from '../utils/prisma.js';

// GET semua course (public - untuk landing page)
export const getAllCourses = async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            include: {
                instructor: {
                    select: { id: true, name: true },
                },
                chapters: {
                    select: { id: true }, // cuma buat hitung jumlah chapter
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Format response: tambahkan chapterCount, hapus array chapters mentah
        const formattedCourses = courses.map((course) => ({
            ...course,
            chapterCount: course.chapters.length,
            chapters: undefined,
        }));

        return res.status(200).json(formattedCourses);
    } catch (error) {
        console.error('Get all courses error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// GET detail 1 course beserta chapters & lessons (public)
export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await prisma.course.findUnique({
            where: { id },
            include: {
                instructor: {
                    select: { id: true, name: true },
                },
                chapters: {
                    orderBy: { orderIndex: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { orderIndex: 'asc' },
                        },
                    },
                },
            },
        });

        if (!course) {
            return res.status(404).json({ message: 'Course tidak ditemukan' });
        }

        return res.status(200).json(course);
    } catch (error) {
        console.error('Get course by id error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// CREATE course baru (instructor only)
export const createCourse = async (req, res) => {
    try {
        const { title, description, category, thumbnail } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ message: 'Title, description, dan category wajib diisi' });
        }

        const course = await prisma.course.create({
            data: {
                title,
                description,
                category,
                thumbnail: thumbnail || null,
                instructorId: req.user.id, // dari verifyToken
            },
        });

        return res.status(201).json({ message: 'Course berhasil dibuat', course });
    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// UPDATE course (instructor only, harus pemilik course)
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, thumbnail } = req.body;

        const existingCourse = await prisma.course.findUnique({ where: { id } });
        if (!existingCourse) {
            return res.status(404).json({ message: 'Course tidak ditemukan' });
        }

        // Cek kepemilikan (ADMIN boleh edit semua, INSTRUCTOR cuma miliknya sendiri)
        if (req.user.role !== 'ADMIN' && existingCourse.instructorId !== req.user.id) {
            return res.status(403).json({ message: 'Kamu tidak punya akses untuk mengedit course ini' });
        }

        const updatedCourse = await prisma.course.update({
            where: { id },
            data: {
                title: title ?? existingCourse.title,
                description: description ?? existingCourse.description,
                category: category ?? existingCourse.category,
                thumbnail: thumbnail ?? existingCourse.thumbnail,
            },
        });

        return res.status(200).json({ message: 'Course berhasil diupdate', course: updatedCourse });
    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// DELETE course (instructor only, harus pemilik course)
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const existingCourse = await prisma.course.findUnique({ where: { id } });
        if (!existingCourse) {
            return res.status(404).json({ message: 'Course tidak ditemukan' });
        }

        if (req.user.role !== 'ADMIN' && existingCourse.instructorId !== req.user.id) {
            return res.status(403).json({ message: 'Kamu tidak punya akses untuk menghapus course ini' });
        }

        await prisma.course.delete({ where: { id } });

        return res.status(200).json({ message: 'Course berhasil dihapus' });
    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};