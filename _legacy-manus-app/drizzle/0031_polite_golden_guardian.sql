ALTER TABLE `blog_comments` MODIFY COLUMN `userId` int;--> statement-breakpoint
ALTER TABLE `blog_comments` ADD `anonEmail` varchar(320);--> statement-breakpoint
ALTER TABLE `blog_comments` ADD `approved` boolean DEFAULT false NOT NULL;