-- AlterTable
ALTER TABLE `lesson` ADD COLUMN `videoUrl` VARCHAR(191) NULL,
    MODIFY `content` TEXT NOT NULL;
