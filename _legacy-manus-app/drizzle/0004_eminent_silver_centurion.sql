CREATE TABLE `faux_tony_chats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`userId` int,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`questionNumber` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `faux_tony_chats_id` PRIMARY KEY(`id`)
);
