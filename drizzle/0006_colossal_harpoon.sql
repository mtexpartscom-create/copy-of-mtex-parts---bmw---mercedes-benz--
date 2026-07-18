ALTER TABLE `users` ADD `userType` enum('b2c','b2b') DEFAULT 'b2c' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `companyName` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `companyTaxId` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `b2bApprovalStatus` enum('pending','approved','rejected') DEFAULT 'pending';