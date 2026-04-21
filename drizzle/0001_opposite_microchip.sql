CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`vehicleId` int,
	`vin` varchar(17),
	`serviceType` varchar(100) NOT NULL,
	`bookingDate` timestamp NOT NULL,
	`status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`email` varchar(320),
	`address` text,
	`city` varchar(100),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `facebookPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicleId` int NOT NULL,
	`postId` varchar(255),
	`imageUrl` text,
	`caption` text,
	`status` enum('draft','published','failed') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`publishedAt` timestamp,
	CONSTRAINT `facebookPosts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partsInquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`vehicleId` int,
	`partName` varchar(255) NOT NULL,
	`vin` varchar(17),
	`status` enum('pending','quoted','ordered','completed','cancelled') NOT NULL DEFAULT 'pending',
	`notes` text,
	`quotedPrice` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partsInquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `serviceHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicleId` int NOT NULL,
	`customerId` int NOT NULL,
	`serviceType` varchar(100) NOT NULL,
	`partsUsed` text,
	`notes` text,
	`serviceDate` timestamp NOT NULL DEFAULT (now()),
	`cost` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `serviceHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`vin` varchar(17) NOT NULL,
	`make` varchar(100),
	`model` varchar(100),
	`year` int,
	`engine` varchar(100),
	`licensePlate` varchar(20),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicles_vin_unique` UNIQUE(`vin`)
);
