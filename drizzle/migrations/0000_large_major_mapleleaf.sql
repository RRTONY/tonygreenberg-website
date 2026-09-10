CREATE TABLE `content_authors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`avatarUrl` varchar(2048),
	`bio` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_authors_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_authors_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `content_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `content_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`slug` varchar(191) NOT NULL,
	`excerpt` text,
	`pullQuote` text,
	`body` json NOT NULL,
	`tags` json NOT NULL,
	`heroImageUrl` varchar(2048),
	`heroImageAlt` text,
	`heroImageWidth` int,
	`heroImageHeight` int,
	`metaTitle` varchar(191),
	`metaDescription` text,
	`ogImageUrl` varchar(2048),
	`noIndex` enum('true','false') NOT NULL DEFAULT 'false',
	`publishedAt` timestamp NOT NULL,
	`sourceUpdatedAt` timestamp,
	`authorId` int NOT NULL,
	`categoryId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `newsletter_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`firstName` varchar(191),
	`source` varchar(191) NOT NULL,
	`consentedAt` timestamp NOT NULL DEFAULT (now()),
	`deliveryStatus` enum('pending','delivered','provider_unavailable','provider_failed') NOT NULL DEFAULT 'pending',
	`deliveredAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `newsletter_subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_subscriptions_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `content_posts` ADD CONSTRAINT `content_posts_authorId_content_authors_id_fk` FOREIGN KEY (`authorId`) REFERENCES `content_authors`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `content_posts` ADD CONSTRAINT `content_posts_categoryId_content_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `content_categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `content_posts_published_at_idx` ON `content_posts` (`publishedAt`);--> statement-breakpoint
CREATE INDEX `content_posts_category_published_idx` ON `content_posts` (`categoryId`,`publishedAt`);