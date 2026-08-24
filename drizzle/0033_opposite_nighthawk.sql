CREATE TABLE `guest_article_edits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`article_slug` varchar(256) NOT NULL,
	`contributor_name` varchar(128) NOT NULL,
	`passphrase_hash` varchar(256) NOT NULL,
	`content` text,
	`is_live` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `guest_article_edits_id` PRIMARY KEY(`id`),
	CONSTRAINT `guest_article_edits_article_slug_unique` UNIQUE(`article_slug`)
);
