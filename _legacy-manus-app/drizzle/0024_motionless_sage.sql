CREATE TABLE `honeypot_bans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ip` varchar(45) NOT NULL,
	`user_agent` text,
	`path` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `honeypot_bans_id` PRIMARY KEY(`id`),
	CONSTRAINT `honeypot_bans_ip_unique` UNIQUE(`ip`)
);
