import prisma from "../utils/prisma";

// Create Quiz 
export const createQuiz = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { title, questions } = req.body;

        // Kondisi jika title dan questions kosong
        if (!title || !Array.isArray(questions) && questions.length === 0) {
            return res.status(400).json({ message: 'Title dan minimal 1 pertanyaan wajib diisi' });
        }

        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { chapter: { include: { course: true } } },
        });

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson tidak ditemukan' });
        }

        // Cek kepemilikan admin dan instructior
        if (req.user.role !== 'ADMIN' && lesson.chapter.course.instructorId !== req.user.id) {
            return res.status(403).json({ message: 'Kamu tidak punya akses untuk mengedit course ini' });
        }

        const existingQuiz = await prisma.quiz.findUnique({ where: { lessonId } });
        if (existingQuiz) {
            return res.status(409).json({ message: 'Lesson ini sudah punya quiz. Hapus dulu kalau mau buat ulang.' });
        }

        // Validasi pilihan jawaban
        for (const q of questions) {
            if (!q.questions || !q.optionA || !q.optionB || !q.optionC || !q.optionD || !q.correctAnswer) {
                return res.status(400).json({ message: 'Setiap pertanyaan wajib punya question, optionA, optionB, optionC, optionD, dan correctAnswer' });
            }

            if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
                return res.status(400).json({ message: 'correctAnswer harus salah satu dari: A, B, C, D' });
            }
        }

        const quiz = await prisma.quiz.create({
            data : {
                lessonId,
                title,
                questions: {
                    create: questions.map((q, index) => ({
                        question: q.question,
                        optionA: q.optionA,
                        optionB: q.optionB,
                        optionC: q.optionC,
                        optionD: q.optionD,
                        correctAnswer: q.correctAnswer,
                        orderIndex: index,
                    })),
                },
            },
            include: { questions: true },
        });

        return res.status(201).json({ message: 'Quiz berhasil dibuat', quiz})
    } catch (error) {
        console.error('Create quiz error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// GET Quiz 1 Lesson
export const getQuizByLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;

        const quiz = await prisma.quiz.findUnique({
            where: { lessonId },
            include: {
                questions: { orderBy: { orderIndex: 'asc' } },
                lesson: { include: { chapter: { include: { course: true } } } },
            },
        });

        if (!quiz) {
            return res.status(401).json({message : 'Quiz belum tersedia untuk lesson ini'});
        }

        const isOwner = req.user.role === 'ADMIN' || quiz.lesson.chapter.course.instructorId === req.user.id;

        const questions = quiz.questions.map((q) => {
            if (isOwner) return q;
            const { correctAnswer, ...questionWithoutAnswer } = q;
            return questionWithoutAnswer;
        });

        return res.status(200).json({
            id: quiz.id,
            title: quiz.title,
            questions,
        });
    } catch (error) {
        console.error('Get quiz error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
}

// SUBMIT Jawaban Quiz
export const submitQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { answers } = req.body;
 
        if (!answers || typeof answers !== 'object') {
            return res.status(400).json({ message: 'answers wajib diisi' });
        }

        const quiz = await prisma.quiz.findUnique({
            where : { id: quizId},
            include : { questions: true }
        });

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz tidak ditemukan' });
        }

        let correctCount = 0;
        quiz.questions.forEach((q) => {
            if (answers[q.id] === q.correctAnswer) {
                correctCount += 1;
            }
        });

        const score = Math.round((correctCount / quiz.questions.length) * 100);
        const PASSING_GRADE = 70;
        const isPassed = score >= PASSING_GRADE;

        const result = await prisma.quizResult.upsert({
            where: {
                userId_quizId: {
                    userId: req.user.id,
                    quizId,
                },
            },
            update: { score, isPassed, completedAt: new Date() },
            create: {
                userId: req.user.id,
                quizId,
                score,
                isPassed,
            },
        });

        return res.status(200).json({
            message: isPassed ? 'Selamat, kamu lulus quiz ini!' : 'Belum lulus, coba lagi ya.',
            score,
            isPassed,
            correctCount,
            totalQuestions: quiz.questions.length,
            result,
        });
    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
}

// GET saat sedang login
export const getMyQuizResult = async (req, res) => {
    try {
        const { quizId } = req.params;
 
        const result = await prisma.quizResult.findUnique({
            where: {
                userId_quizId: {
                    userId: req.user.id,
                    quizId,
                },
            },
        });
 
        return res.status(200).json(result || null);
    } catch (error) {
        console.error('Get my quiz result error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// DELETE quiz (instructor pemilik course / admin)
export const deleteQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
 
        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: { lesson: { include: { chapter: { include: { course: true } } } } },
        });
 
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz tidak ditemukan' });
        }
 
        if (req.user.role !== 'ADMIN' && quiz.lesson.chapter.course.instructorId !== req.user.id) {
            return res.status(403).json({ message: 'Kamu tidak punya akses untuk menghapus quiz ini' });
        }
 
        await prisma.quiz.delete({ where: { id: quizId } });
 
        return res.status(200).json({ message: 'Quiz berhasil dihapus' });
    } catch (error) {
        console.error('Delete quiz error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};