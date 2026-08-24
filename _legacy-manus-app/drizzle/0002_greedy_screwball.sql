CREATE TABLE `blog_ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postSlug` varchar(256) NOT NULL,
	`rating` varchar(32) NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_ratings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `email_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`source` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_subscribers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `page_views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`path` varchar(512) NOT NULL,
	`postSlug` varchar(256),
	`sessionId` varchar(128) NOT NULL,
	`referrer` varchar(512),
	`userAgent` varchar(512),
	`readTimeMs` int DEFAULT 0,
	`scrollDepth` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `page_views_id` PRIMARY KEY(`id`)
);
