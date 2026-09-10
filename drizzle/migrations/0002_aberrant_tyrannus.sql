CREATE TABLE `visitor_states` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorId` varchar(64) NOT NULL,
	`namespace` varchar(64) NOT NULL,
	`value` json NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `visitor_states_id` PRIMARY KEY(`id`),
	CONSTRAINT `visitor_states_visitor_namespace_unique` UNIQUE(`visitorId`,`namespace`)
);
--> statement-breakpoint
CREATE INDEX `visitor_states_expires_at_idx` ON `visitor_states` (`expiresAt`);