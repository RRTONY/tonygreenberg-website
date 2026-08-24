CREATE TABLE `cheshire_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`relationship` varchar(128) NOT NULL,
	`city` varchar(256),
	`dateRange` varchar(128),
	`promisedVsDelivered` text NOT NULL,
	`receivedPayment` enum('yes','partial','no') NOT NULL,
	`amountOwed` varchar(64),
	`hasDocumentation` varchar(128),
	`willingToContact` boolean DEFAULT false,
	`contactEmail` varchar(320),
	`howHeard` text,
	`status` enum('new','reviewed','actionable','archived') NOT NULL DEFAULT 'new',
	`ipHash` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cheshire_submissions_id` PRIMARY KEY(`id`)
);
