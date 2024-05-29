-- DropIndex
DROP INDEX `Answers_question_id_fkey` ON `answers`;

-- DropIndex
DROP INDEX `Articles_author_id_fkey` ON `articles`;

-- DropIndex
DROP INDEX `Articles_category_id_fkey` ON `articles`;

-- DropIndex
DROP INDEX `Chapters_formation_id_fkey` ON `chapters`;

-- DropIndex
DROP INDEX `Formations_author_id_fkey` ON `formations`;

-- DropIndex
DROP INDEX `Formations_category_id_fkey` ON `formations`;

-- DropIndex
DROP INDEX `Progressions_chapter_id_fkey` ON `progressions`;

-- DropIndex
DROP INDEX `Questions_chapter_id_fkey` ON `questions`;

-- DropIndex
DROP INDEX `Ratings_formation_id_fkey` ON `ratings`;

-- DropIndex
DROP INDEX `Users_role_id_fkey` ON `users`;

-- AddForeignKey
ALTER TABLE `Answers` ADD CONSTRAINT `Answers_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `Questions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Articles` ADD CONSTRAINT `Articles_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Articles` ADD CONSTRAINT `Articles_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chapters` ADD CONSTRAINT `Chapters_formation_id_fkey` FOREIGN KEY (`formation_id`) REFERENCES `Formations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Formations` ADD CONSTRAINT `Formations_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Formations` ADD CONSTRAINT `Formations_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Progressions` ADD CONSTRAINT `Progressions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Progressions` ADD CONSTRAINT `Progressions_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `Chapters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Questions` ADD CONSTRAINT `Questions_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `Chapters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ratings` ADD CONSTRAINT `Ratings_formation_id_fkey` FOREIGN KEY (`formation_id`) REFERENCES `Formations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
