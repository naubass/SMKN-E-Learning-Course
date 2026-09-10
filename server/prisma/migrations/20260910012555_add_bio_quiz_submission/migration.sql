-- AlterTable
ALTER TABLE `course` ADD COLUMN `bio` VARCHAR(191) NULL,
    MODIFY `description` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `Quiz` (
    `id` VARCHAR(191) NOT NULL,
    `lessonId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Quiz_lessonId_key`(`lessonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuizQuestion` (
    `id` VARCHAR(191) NOT NULL,
    `quizId` VARCHAR(191) NOT NULL,
    `question` TEXT NOT NULL,
    `optionA` VARCHAR(191) NOT NULL,
    `optionB` VARCHAR(191) NOT NULL,
    `optionC` VARCHAR(191) NOT NULL,
    `optionD` VARCHAR(191) NOT NULL,
    `correctAnswer` ENUM('A', 'B', 'C', 'D') NOT NULL,
    `orderIndex` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuizResult` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `quizId` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,
    `isPassed` BOOLEAN NOT NULL DEFAULT false,
    `completedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `QuizResult_userId_quizId_key`(`userId`, `quizId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Submission` (
    `id` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `instructions` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Submission_courseId_key`(`courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubmissionEntry` (
    `id` VARCHAR(191) NOT NULL,
    `submissionId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `feedback` TEXT NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reviewedAt` DATETIME(3) NULL,

    UNIQUE INDEX `SubmissionEntry_submissionId_userId_key`(`submissionId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Quiz` ADD CONSTRAINT `Quiz_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizQuestion` ADD CONSTRAINT `QuizQuestion_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizResult` ADD CONSTRAINT `QuizResult_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizResult` ADD CONSTRAINT `QuizResult_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubmissionEntry` ADD CONSTRAINT `SubmissionEntry_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `Submission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubmissionEntry` ADD CONSTRAINT `SubmissionEntry_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
