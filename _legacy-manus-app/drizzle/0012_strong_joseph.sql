CREATE TABLE `purchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stripeSessionId` varchar(256) NOT NULL,
	`stripePaymentIntentId` varchar(256),
	`productKey` varchar(128) NOT NULL,
	`amountCents` int NOT NULL,
	`currency` varchar(8) NOT NULL DEFAULT 'usd',
	`status` enum('completed','refunded') NOT NULL DEFAULT 'completed',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `purchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stripeSubscriptionId` varchar(256) NOT NULL,
	`productKey` varchar(128) NOT NULL,
	`status` enum('active','canceled','past_due','unpaid') NOT NULL DEFAULT 'active',
	`currentPeriodEnd` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(128);