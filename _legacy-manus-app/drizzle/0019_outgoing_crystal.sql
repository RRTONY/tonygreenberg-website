CREATE TABLE `report_endorsements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportSlug` varchar(128) NOT NULL,
	`bkAnswer1` text NOT NULL,
	`bkAnswer2` text NOT NULL,
	`bkAnswer3` text NOT NULL,
	`bkAnswer4` text NOT NULL,
	`endorsementStatement` text NOT NULL,
	`sessionHash` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `report_endorsements_id` PRIMARY KEY(`id`)
);
