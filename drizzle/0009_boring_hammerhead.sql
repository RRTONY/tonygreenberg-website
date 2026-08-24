CREATE TABLE `journey_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`experienceId` varchar(128) NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	`resultData` text,
	CONSTRAINT `journey_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `assessment_results` MODIFY COLUMN `assessmentType` enum('dharma','consciousness','grant-study','mirror','find-your-me','therapy','sake','spirit','religion','diet','movement','sleep','coffee','kitchen','style','attachment','love-language') NOT NULL;