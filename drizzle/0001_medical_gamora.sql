CREATE TABLE `ai_evaluations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`candidateId` int NOT NULL,
	`overallScore` decimal(5,2) DEFAULT '0',
	`strengths` text,
	`risks` text,
	`suggestions` text,
	`detailedAnalysis` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ai_evaluations_id` PRIMARY KEY(`id`),
	CONSTRAINT `ai_evaluations_candidateId_unique` UNIQUE(`candidateId`)
);
--> statement-breakpoint
CREATE TABLE `candidates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`avatar` text,
	`position` varchar(100) NOT NULL,
	`yearsOfExperience` int DEFAULT 0,
	`location` varchar(100),
	`expectedSalary` varchar(50),
	`summary` text,
	`matchScore` decimal(5,2) DEFAULT '0',
	`status` enum('pending','reviewing','interviewed','offered','rejected') DEFAULT 'pending',
	`resumeFileUrl` text,
	`resumeFileKey` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `candidates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `educations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`candidateId` int NOT NULL,
	`school` varchar(200) NOT NULL,
	`degree` varchar(50),
	`major` varchar(100),
	`startDate` varchar(20),
	`endDate` varchar(20),
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `educations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`candidateId` int NOT NULL,
	`name` varchar(200) NOT NULL,
	`role` varchar(100),
	`startDate` varchar(20),
	`endDate` varchar(20),
	`description` text,
	`technologies` text,
	`achievements` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`candidateId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`level` enum('beginner','intermediate','advanced','expert') DEFAULT 'intermediate',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `skills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `work_experiences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`candidateId` int NOT NULL,
	`company` varchar(200) NOT NULL,
	`position` varchar(100) NOT NULL,
	`startDate` varchar(20),
	`endDate` varchar(20),
	`description` text,
	`achievements` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `work_experiences_id` PRIMARY KEY(`id`)
);
