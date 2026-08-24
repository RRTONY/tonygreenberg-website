CREATE TABLE `pri_calibrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`userId` int,
	`rankings` text NOT NULL,
	`pairwiseChoices` text NOT NULL,
	`dimScores` text NOT NULL,
	`researchOptIn` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pri_calibrations_id` PRIMARY KEY(`id`)
);
