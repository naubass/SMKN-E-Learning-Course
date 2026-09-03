import prisma from '../utils/prisma.js';

// CREATE chapter baru
export const createChapter = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, orderIndex } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title wajib diisi' });
        }

        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
            return res.status(404).json({ message: 'Course tidak ditemukan' });
        }

        // Cek kepemilikan (ADMIN boleh edit semua, INSTRUCTOR cuma miliknya sendiri)
        if (req.user.role !== 'ADMIN' && course.instructorId !== req.user.id) {
            return res.status(403).json({ message: 'Kamu tidak punya akses untuk mengedit course ini' });
        }

        // Kalau orderIndex tidak dikirim, taruh di urutan terakhir
        let finalOrderIndex = orderIndex;
        if (finalOrderIndex === undefined || finalOrderIndex === null) {
            const lastChapter = await prisma.chapter.findFirst({
                where: { courseId },
                orderBy: { orderIndex: 'desc' },
            });
            finalOrderIndex = lastChapter ? lastChapter.orderIndex + 1 : 0;
        }

        const chapter = await prisma.chapter.create({
            data : {
                title,
                orderIndex: finalOrderIndex,
                courseId
            }
        });

        return res.status(201).json({ message: 'Chapter berhasil dibuat', chapter });
    } catch (error) {
        console.error('Create chapter error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
}

// GET detail 1 chapter beserta lessons
export const getChaptersByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const chapters = await prisma.chapter.findMany({
            where: { courseId },
            orderBy: { orderIndex: 'asc' },
            include: {
                lessons: {
                    orderBy: { orderIndex: 'asc' },
                },
            },
        });

        return res.status(200).json(chapters);
    } catch (error) {
        console.error('Get chapter by course error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
}

// UPDATE chapter (ADMIN boleh edit semua, INSTRUCTOR cuma miliknya sendiri)
export const updateChapter = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, orderIndex } = req.body;

        const existingChapter = await prisma.chapter.findUnique({ where: { id }, include: { course: true } });
        if (!existingChapter) {
            return res.status(404).json({ message: 'Chapter tidak ditemukan' });
        }

        // Cek kepemilikan (ADMIN boleh edit semua, INSTRUCTOR cuma miliknya sendiri)
        if (req.user.role !== 'ADMIN' && existingChapter.course.instructorId !== req.user.id) {
            return res.status(403).json({ message: 'Kamu tidak punya akses untuk mengedit course ini' });
        }

        const updatedChapter = await prisma.chapter.update({
            where: { id },
            data: {
                title: title ?? existingChapter.title,
                orderIndex: orderIndex ?? existingChapter.orderIndex,
            },
        });

        return res.status(200).json({ message: 'Chapter berhasil diupdate', chapter: updatedChapter });
    } catch (error) {
        console.error('Update chapter error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
}  

// DELETE chapter (ADMIN boleh edit semua, INSTRUCTOR cuma miliknya sendiri)
export const deleteChapter = async (req, res) => {
    try {
        const { id } = req.params;

        const existingChapter = await prisma.chapter.findUnique({ where: { id }, include: { course: true } });
        if (!existingChapter) {
            return res.status(404).json({ message: 'Chapter tidak ditemukan' });
        }

        // Cek kepemilikan (ADMIN boleh edit semua, INSTRUCTOR cuma miliknya sendiri)
        if (req.user.role !== 'ADMIN' && existingChapter.course.instructorId !== req.user.id) {
            return res.status(403).json({ message: 'Kamu tidak punya akses untuk menghapus course ini' });
        }

        await prisma.chapter.delete({ where: { id } });

        return res.status(200).json({ message: 'Chapter berhasil dihapus' });
    } catch (error) {
        console.error('Delete chapter error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
}