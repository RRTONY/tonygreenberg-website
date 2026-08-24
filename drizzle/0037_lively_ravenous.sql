CREATE TABLE `post_intervention_assessments` (
	`id` varchar(36) NOT NULL,
	`session_token` varchar(128) NOT NULL,
	`day_choice` int NOT NULL,
	`facilitator_ref` varchar(256),
	`intervention_type` enum('psychedelic','meditation','breathwork','ceremony','other') NOT NULL DEFAULT 'psychedelic',
	`integration_score` int,
	`safety_score` int,
	`trust_score` int,
	`would_recommend` enum('yes','no','unsure'),
	`responses` text,
	`went_well` text,
	`could_improve` text,
	`message_to_facilitator` text,
	`notified` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_intervention_assessments_id` PRIMARY KEY(`id`)
);
