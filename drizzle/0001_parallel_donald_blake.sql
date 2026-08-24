CREATE TABLE `riddle_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`postSlug` varchar(256) NOT NULL,
	`attempt` int NOT NULL,
	`answer` text NOT NULL,
	`correct` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `riddle_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `riddle_solvers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`postSlug` varchar(256) NOT NULL,
	`solvedOnAttempt` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `riddle_solvers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `share_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postSlug` varchar(256) NOT NULL,
	`shareType` varchar(64) NOT NULL,
	`userId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `share_events_id` PRIMARY KEY(`id`)
);
