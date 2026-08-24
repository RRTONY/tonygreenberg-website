CREATE TABLE `search_index` (
	`id` int AUTO_INCREMENT NOT NULL,
	`content_key` varchar(512) NOT NULL,
	`title` varchar(512) NOT NULL,
	`path` varchar(512) NOT NULL,
	`excerpt` text,
	`body` text,
	`category` varchar(64) NOT NULL,
	`subcategory` varchar(128),
	`tags` text,
	`image_url` text,
	`boost` int NOT NULL DEFAULT 1,
	`content_updated_at` timestamp NOT NULL DEFAULT (now()),
	`indexed_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `search_index_id` PRIMARY KEY(`id`),
	CONSTRAINT `search_index_content_key_unique` UNIQUE(`content_key`)
);
--> statement-breakpoint
CREATE TABLE `search_queries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`query` varchar(512) NOT NULL,
	`result_count` int NOT NULL DEFAULT 0,
	`clicked_path` varchar(512),
	`session_id` varchar(128),
	`user_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `search_queries_id` PRIMARY KEY(`id`)
);
