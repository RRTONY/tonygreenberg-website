CREATE TABLE `friend_gate_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`seeker_token` varchar(128) NOT NULL,
	`pri_session_id` int,
	`seeker_name` varchar(128),
	`status` enum('pending','open','blocked') NOT NULL DEFAULT 'pending',
	`resolved_at` timestamp,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `friend_gate_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `friend_gate_sessions_seeker_token_unique` UNIQUE(`seeker_token`)
);
--> statement-breakpoint
CREATE TABLE `friend_gate_slots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` int NOT NULL,
	`slot_index` int NOT NULL,
	`friend_name` varchar(128),
	`contact_type` varchar(16) NOT NULL,
	`contact_value` varchar(320) NOT NULL,
	`contact_hash` varchar(64) NOT NULL,
	`survey_token` varchar(128) NOT NULL,
	`otp_hash` varchar(256),
	`otp_expires_at` timestamp,
	`verified` boolean NOT NULL DEFAULT false,
	`verified_at` timestamp,
	`survey_response` text,
	`verdict` enum('support','wait','unsure'),
	`responded_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `friend_gate_slots_id` PRIMARY KEY(`id`),
	CONSTRAINT `friend_gate_slots_survey_token_unique` UNIQUE(`survey_token`)
);
