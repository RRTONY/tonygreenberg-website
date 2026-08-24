CREATE TABLE `facilitator_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`coded_identity` varchar(128),
	`responses` text NOT NULL,
	`pathway_responses` text,
	`referral_consent` boolean NOT NULL DEFAULT false,
	`referral_region` varchar(256),
	`referral_contact` varchar(512),
	`locale` varchar(64),
	`status` varchar(32) NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `facilitator_submissions_id` PRIMARY KEY(`id`)
);
