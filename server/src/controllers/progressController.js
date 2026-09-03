import prisma from '../utils/prisma.js';

// Tandai lesson selesai / belum selesai (toggle via body isCompleted)
export const markLessonProgress = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { isCompleted } = req.body;

        if (typeof isCompleted !== 'boolean') {
            return res.status(400).json({ message: 'isCompleted wajib diisi (true/false)' });
        }

        const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson tidak ditemukan' });
        }

        // upsert: kalau progress buat lesson ini + user ini sudah ada, update.
        // kalau belum ada, buat baru. (unique constraint: userId + lessonId)
        const progress = await prisma.userProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: req.user.id,
                    lessonId,
                },
            },
            update: { isCompleted },
            create: {
                userId: req.user.id,
                lessonId,
                isCompleted,
            },
        });

        return res.status(200).json({ message: 'Progress berhasil diupdate', progress });
    } catch (error) {
        console.error('Mark lesson progress error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Hitung persentase progress user untuk 1 course tertentu
export const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
            return res.status(404).json({ message: 'Course tidak ditemukan' });
        }

        // Total semua lesson dalam course ini (lewat semua chapter-nya)
        const totalLessons = await prisma.lesson.count({
            where: { chapter: { courseId } },
        });

        // Total lesson yang sudah ditandai selesai oleh user ini
        const completedLessons = await prisma.userProgress.count({
            where: {
                userId: req.user.id,
                isCompleted: true,
                lesson: { chapter: { courseId } },
            },
        });

        const percentage = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

        return res.status(200).json({
            courseId,
            totalLessons,
            completedLessons,
            percentage,
        });
    } catch (error) {
        console.error('Get course progress error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Ambil semua progress lesson milik user yang sedang login (buat cek status per-lesson di frontend)
export const getMyProgressForCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const progressList = await prisma.userProgress.findMany({
            where: {
                userId: req.user.id,
                lesson: { chapter: { courseId } },
            },
            select: {
                lessonId: true,
                isCompleted: true,
            },
        });

        return res.status(200).json(progressList);
    } catch (error) {
        console.error('Get my progress error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};