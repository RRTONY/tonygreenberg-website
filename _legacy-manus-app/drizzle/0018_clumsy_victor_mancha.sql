CREATE TABLE `spam_forwards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rawSubject` text,
	`rawFrom` varchar(512),
	`extractedCompany` varchar(256),
	`extractedDomain` varchar(256),
	`extractedEmail` varchar(320),
	`generatedUrl` text,
	`forwardedBy` varchar(320),
	`processed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `spam_forwards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `spam_page_views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`company` varchar(256),
	`domain` varchar(256),
	`email` varchar(320),
	`ipHash` varchar(64),
	`userAgent` text,
	`referer` text,
	`viewCount` int NOT NULL DEFAULT 1,
	`firstViewedAt` timestamp NOT NULL DEFAULT (now()),
	`lastViewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `spam_page_views_id` PRIMARY KEY(`id`)
);
