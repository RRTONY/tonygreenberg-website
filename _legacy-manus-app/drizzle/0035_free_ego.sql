CREATE TABLE `facilitator_usage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`event` varchar(50) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `facilitator_usage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `facilitator_votes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`option` varchar(100) NOT NULL,
	`voter_fingerprint` varchar(64),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `facilitator_votes_id` PRIMARY KEY(`id`)
);
