CREATE TABLE `favoriteProducts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favoriteProducts_id` PRIMARY KEY(`id`),
	CONSTRAINT `favoriteProducts_user_product_unique` UNIQUE(`userId`,`productId`)
);
--> statement-breakpoint
CREATE INDEX `favoriteProducts_user_idx` ON `favoriteProducts` (`userId`);