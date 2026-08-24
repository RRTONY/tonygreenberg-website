CREATE TABLE `article_read_counts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postSlug` varchar(256) NOT NULL,
	`version` varchar(32) NOT NULL DEFAULT 'short',
	`count` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `article_read_counts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postSlug` varchar(256) NOT NULL,
	`userId` int NOT NULL,
	`userName` varchar(256) NOT NULL,
	`content` text NOT NULL,
	`parentId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_comments_id` PRIMARY KEY(`id`)
);
