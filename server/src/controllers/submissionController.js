import prisma from '../utils/prisma.js';

// CREATE syarat submission akhir untuk 1 course (instructor pemilik / admin)
export const createSubmission = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, instructions } = req.body;

        if (!title || !instructions) {
            return res.status(400).json({ message: 'Title dan instructions wajib diisi' });
        }

        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
            return res.status(404).json({ message: 'Course tidak ditemukan' });
        }

        if (req.user.role !== 'ADMIN' && course.instructorId !== req.user.id) {
            return res.status(403).json({ message: 'Kamu tidak punya akses ke course ini' });
        }

        const existing = await prisma.submission.findUnique({ where: { courseId } });
        if (existing) {
            return res.status(409).json({ message: 'Course ini sudah punya submission akhir' });
        }

        const submission = await prisma.submission.create({
            data: { courseId, title, instructions },
        });

        return res.status(201).json({ message: 'Submission berhasil dibuat', submission });
    } catch (error) {
        console.error('Create submission error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// GET syarat submission + entry milik user yang login (kalau sudah pernah submit)
export const getSubmissionByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const submission = await prisma.submission.findUnique({ where: { courseId } });

        if (!submission) {
            return res.status(404).json({ message: 'Course ini belum punya submission akhir' });
        }

        const myEntry = await prisma.submissionEntry.findUnique({
            where: {
                submissionId_userId: {
                    submissionId: submission.id,
                    userId: req.user.id,
                },
            },
        });

        return res.status(200).json({ ...submission, myEntry });
    } catch (error) {
        console.error('Get submission error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// SUBMIT/KUMPULKAN tugas akhir (student). Boleh dikirim ulang -> status balik ke PENDING.
export const submitEntry = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content submission wajib diisi (link/deskripsi tugas)' });
        }

        const submission = await prisma.submission.findUnique({ where: { id: submissionId } });
        if (!submission) {
            return res.status(404).json({ message: 'Submission tidak ditemukan' });
        }

        // upsert: submit ulang otomatis timpa entry lama & reset ke PENDING (perlu di-review lagi)
        const entry = await prisma.submissionEntry.upsert({
            where: {
                submissionId_userId: {
                    submissionId,
                    userId: req.user.id,
                },
            },
            update: {
                content,
                status: 'PENDING',
                feedback: null,
                submittedAt: new Date(),
                reviewedAt: null,
            },
            create: {
                submissionId,
                userId: req.user.id,
                content,
            },
        });

        return res.status(200).json({ message: 'Submission berhasil dikirim', entry });
    } catch (error) {
        console.error('Submit entry error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// GET semua entry siswa untuk direview (instructor pemilik course / admin)
export const getEntriesForReview = async (req, res) => {
    try {
        const { submissionId } = req.params;

        const submission = await prisma.submission.findUnique({
            where: { id: submissionId },
            include: { course: true },
        });

        if (!submission) {
            return res.status(404).json({ message: 'Submission tidak ditemukan' });
        }

        if (req.user.role !== 'ADMIN' && submission.course.instructorId !== req.user.id) {
            return res.status(403).json({ message: 'Kamu tidak punya akses ke submission ini' });
        }

        const entries = await prisma.submissionEntry.findMany({
            where: { submissionId },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { submittedAt: 'desc' },
        });

        return res.status(200).json(entries);
    } catch (error) {
        console.error('Get entries error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// REVIEW 1 entry: terima/tolak + kasih feedback (instructor pemilik course / admin)
export const reviewEntry = async (req, res) => {
    try {
        const { entryId } = req.params;
        const { status, feedback } = req.body;

        if (!['ACCEPTED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ message: 'status harus ACCEPTED atau REJECTED' });
        }

        const entry = await prisma.submissionEntry.findUnique({
            where: { id: entryId },
            include: { submission: { include: { course: true } } },
        });

        if (!entry) {
            return res.status(404).json({ message: 'Entry tidak ditemukan' });
        }

        if (req.user.role !== 'ADMIN' && entry.submission.course.instructorId !== req.user.id) {
            return res.status(403).json({ message: 'Kamu tidak punya akses untuk review entry ini' });
        }

        const updated = await prisma.submissionEntry.update({
            where: { id: entryId },
            data: {
                status,
                feedback: feedback || null,
                reviewedAt: new Date(),
            },
        });

        return res.status(200).json({ message: 'Review berhasil disimpan', entry: updated });
    } catch (error) {
        console.error('Review entry error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};