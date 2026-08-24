CREATE TABLE `short_urls` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(12) NOT NULL,
	`target_path` text NOT NULL,
	`clicks` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `short_urls_id` PRIMARY KEY(`id`),
	CONSTRAINT `short_urls_code_unique` UNIQUE(`code`)
);
