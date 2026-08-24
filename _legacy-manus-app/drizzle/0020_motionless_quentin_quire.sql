CREATE TABLE `notification_reads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`notificationId` int NOT NULL,
	`readAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notification_reads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('broadcast','personal') NOT NULL DEFAULT 'broadcast',
	`category` varchar(64) NOT NULL DEFAULT 'announcement',
	`title` varchar(512) NOT NULL,
	`message` text NOT NULL,
	`link` varchar(512),
	`targetUserId` int,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
