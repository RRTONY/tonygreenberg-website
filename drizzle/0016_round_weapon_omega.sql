CREATE TABLE `spam_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(256) NOT NULL,
	`senderEmail` varchar(320) NOT NULL,
	`spamType` enum('cold-outreach','unsolicited-newsletter','ai-generated-spam','phishing-scam') NOT NULL,
	`frequency` enum('one-time','weekly','daily','multiple-daily') NOT NULL,
	`description` text NOT NULL,
	`reporterEmail` varchar(320),
	`ipHash` varchar(64),
	`verified` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `spam_reports_id` PRIMARY KEY(`id`)
);
