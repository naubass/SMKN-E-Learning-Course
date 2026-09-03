import prisma from '../utils/prisma.js';

// Create Lessons
export const createLesson = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const { title, content, videoUrl, orderIndex } = req.body;

        if (!title || !content ) {
            return res.status(400).json({ message: 'Title, content wajib diisi' });
        }

        // Find the chapter
        const chapter = await prisma.chapter.findUnique({
            where : { id: chapterId },
            include: { course: true }
        });
        
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter tidak ditemukan' });
        }

        // Cek kepemilikan (ADMIN boleh edit semua, INSTRUCTOR cuma miliknya sendiri)
        if (req.user.role !== 'ADMIN' && chapter.course.instructorId !== req.user.id) {
            return res.status(403).json({ message: 'Kamu tidak punya akses untuk mengedit course ini' });
        }

        // Jika orderIndex tidak dikirim, taruh di urutan terakhir
        let finalOrderIndex = orderIndex;
        if (finalOrderIndex === undefined || finalOrderIndex === null) {
            const lastLesson = await prisma.lesson.findFirst({
                where: { chapterId },
                orderBy: { orderIndex: 'desc' },
            });
            finalOrderIndex = lastLesson ? lastLesson.orderIndex + 1 : 0;
        }

        const lesson = await prisma.lesson.create({
            data : {
                title,
                content,
                videoUrl: videoUrl || null,
                orderIndex: finalOrderIndex,
                chapterId
            }
        });

        res.status(200).json({ message: 'Lesson berhasil dibuat', lesson });
    } catch (error) {
        console.error('Create lesson error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
}

// GET semua lesson dalam 1 chapter (public)
export const getLessonsByChapter = async (req, res) => {
    try {
        const { chapterId } = req.params;

        const lessons = await prisma.lesson.findMany({
            where: { chapterId },
            orderBy: { orderIndex: 'asc' },
        });

        return res.status(200).json(lessons);
    } catch (error) {
        console.error('Get lessons by chapter error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// GET detail 1 lesson beserta course & chapter 
export const getLessonById = async (req, res) => {
    try {
        const { id } = req.params;

        const lesson = await prisma.lesson.findUnique({
            where: { id },
            include: {
                chapter: {
                    include: { course: { select: { id: true, title: true } } },
                },
            },
        });

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson tidak ditemukan' });
        }

        return res.status(200).json(lesson);
    } catch (error) {
        console.error('Get lesson by chapter error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
}

// UPDATE lesson hanya Admin dan Instructor
export const updateLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, videoUrl, orderIndex } = req.body;

        const existingLesson = await prisma.lesson.findUnique({
            where: { id },
            include: { chapter: { include: { course: true } } },
        });

        if (!existingLesson) {
            return res.status(404).json({ message: 'Lesson tidak ditemukan' });
        }

        // Cek kepemilikan (ADMIN boleh edit semua, INSTRUCTOR cuma miliknya sendiri)
        if (req.user.role !== 'ADMIN' && existingLesson.chapter.course.instructorId !== req.user.id) {
            return res.status(403).json({ message: 'Kamu tidak punya akses untuk mengedit course ini' });
        }

        const updatedLesson = await prisma.lesson.update({
            where: { id },
            data: {
                title: title ?? existingLesson.title,
                content: content ?? existingLesson.content,
                videoUrl: videoUrl !== undefined ? videoUrl : existingLesson.videoUrl,
                orderIndex: orderIndex ?? existingLesson.orderIndex,
            },
        });

        return res.status(200).json({ message: 'Lesson berhasil diupdate', lesson: updatedLesson });
    } catch (error) {
        console.error('Update lesson error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
}

// DELETE lesson hanya Admin dan Instructor
export const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;

        const existingLesson = await prisma.lesson.findUnique({
            where: { id },
            include: { chapter: { include: { course: true } } },
        });

        if (!existingLesson) {
            return res.status(404).json({ message: 'Lesson tidak ditemukan' });
        }

        // Cek kepemilikan (ADMIN boleh edit semua, INSTRUCTOR cuma miliknya sendiri)
        if (req.user.role !== 'ADMIN' && existingLesson.chapter.course.instructorId !== req.user.id) {
            return res.status(403).json({ message: 'Kamu tidak punya akses untuk menghapus course ini' });
        }

        await prisma.lesson.delete({ where: { id } });

        return res.status(200).json({ message: 'Lesson berhasil dihapus' });
    } catch (error) {
        console.error('Delete lesson error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
}