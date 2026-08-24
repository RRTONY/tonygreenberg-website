CREATE TABLE `community_connections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`memberAId` int NOT NULL,
	`memberBId` int NOT NULL,
	`connectionType` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `community_connections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `community_contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`uploadedBy` int NOT NULL,
	`name` varchar(256) NOT NULL,
	`email` varchar(320),
	`phone` varchar(64),
	`relationship` varchar(128),
	`note` text,
	`invited` boolean NOT NULL DEFAULT false,
	`invitedAt` timestamp,
	`joinedUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `community_contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `community_invitations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inviterId` int NOT NULL,
	`contactId` int,
	`email` varchar(320) NOT NULL,
	`inviteCode` varchar(64) NOT NULL,
	`message` text,
	`status` enum('pending','accepted','expired') NOT NULL DEFAULT 'pending',
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`acceptedAt` timestamp,
	CONSTRAINT `community_invitations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `community_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`displayName` varchar(256) NOT NULL,
	`bio` text,
	`lookingFor` text,
	`interests` text,
	`location` varchar(256),
	`website` varchar(512),
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `community_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `manifesto_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`name` varchar(256),
	`email` varchar(320),
	`biggestChallenge` text,
	`whatToMeasure` text,
	`referenceSites` text,
	`newIndices` text,
	`howToParticipate` text,
	`abundantLife` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `manifesto_responses_id` PRIMARY KEY(`id`)
);
