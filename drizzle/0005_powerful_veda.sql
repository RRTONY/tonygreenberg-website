CREATE TABLE `assessment_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assessmentType` enum('dharma','consciousness','grant-study') NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`userId` int,
	`answers` text NOT NULL,
	`resultSummary` text NOT NULL,
	`totalScore` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assessment_results_id` PRIMARY KEY(`id`)
);
