CREATE TABLE `post_reactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postSlug` varchar(256) NOT NULL,
	`reaction` enum('up','down','neutral') NOT NULL,
	`comment` text,
	`sessionId` varchar(128) NOT NULL,
	`userId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_reactions_id` PRIMARY KEY(`id`)
);
