CREATE TABLE `interviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`candidateId` int NOT NULL,
	`interviewDate` timestamp NOT NULL,
	`interviewer` varchar(100),
	`interviewType` enum('phone','video','onsite','technical','hr') DEFAULT 'onsite',
	`feedback` text,
	`rating` int,
	`result` enum('pending','passed','failed','on_hold') DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `interviews_id` PRIMARY KEY(`id`)
);
