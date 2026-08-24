CREATE TABLE `pri_consents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`initials` varchar(10) NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`userId` int,
	`ipHash` varchar(64),
	`consentVersion` varchar(16) NOT NULL DEFAULT '1.0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pri_consents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pri_corrections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`medicineId` varchar(64) NOT NULL,
	`fieldName` varchar(64) NOT NULL,
	`currentContent` text,
	`suggestedContent` text NOT NULL,
	`sourceUrl` varchar(512),
	`submitterName` varchar(256),
	`submitterEmail` varchar(320),
	`sessionId` varchar(128) NOT NULL,
	`userId` int,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pri_corrections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `assessment_results` MODIFY COLUMN `assessmentType` enum('dharma','consciousness','grant-study','mirror','find-your-me','therapy','sake','spirit','religion','diet','movement','sleep','coffee','kitchen','style','attachment','love-language','psychedelic-readiness') NOT NULL;