CREATE TABLE `engagement_audits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`email` varchar(320) NOT NULL,
	`organization` varchar(256),
	`impactInitiative` text NOT NULL,
	`impactOutcomes` text NOT NULL,
	`whyTony` text NOT NULL,
	`priorAction` text NOT NULL,
	`resourcesCommitted` text NOT NULL,
	`totalScore` int NOT NULL,
	`outcome` enum('qualified','not-ready','wrong-fit') NOT NULL,
	`adminNotes` text,
	`stage` enum('submitted','reviewed','meeting-booked','30-day-review','stage-2','declined') NOT NULL DEFAULT 'submitted',
	`userId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `engagement_audits_id` PRIMARY KEY(`id`)
);
