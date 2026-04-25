CREATE TABLE `vehicleListings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`make` varchar(100) NOT NULL,
	`model` varchar(100) NOT NULL,
	`year` int,
	`engine` varchar(100),
	`transmission` varchar(50),
	`mileage` int,
	`price` varchar(50),
	`description` text,
	`features` text,
	`imageUrls` text,
	`primaryImageUrl` text,
	`status` enum('active','sold','archived') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicleListings_id` PRIMARY KEY(`id`)
);
