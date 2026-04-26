import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// CRM Tables

/**
 * Customers table - stores customer information
 */
export const customers = mysqlTable("customers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

/**
 * Vehicles table - stores vehicle information linked to customers
 */
export const vehicles = mysqlTable("vehicles", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  vin: varchar("vin", { length: 17 }).notNull().unique(),
  make: varchar("make", { length: 100 }),
  model: varchar("model", { length: 100 }),
  year: int("year"),
  engine: varchar("engine", { length: 100 }),
  licensePlate: varchar("licensePlate", { length: 20 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = typeof vehicles.$inferInsert;

/**
 * Service History table - tracks repairs and maintenance
 */
export const serviceHistory = mysqlTable("serviceHistory", {
  id: int("id").autoincrement().primaryKey(),
  vehicleId: int("vehicleId").notNull(),
  customerId: int("customerId").notNull(),
  serviceType: varchar("serviceType", { length: 100 }).notNull(),
  partsUsed: text("partsUsed"),
  notes: text("notes"),
  serviceDate: timestamp("serviceDate").defaultNow().notNull(),
  cost: varchar("cost", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ServiceHistory = typeof serviceHistory.$inferSelect;
export type InsertServiceHistory = typeof serviceHistory.$inferInsert;

/**
 * Parts Inquiries table - tracks customer inquiries for parts
 */
export const partsInquiries = mysqlTable("partsInquiries", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  vehicleId: int("vehicleId"),
  partName: varchar("partName", { length: 255 }).notNull(),
  vin: varchar("vin", { length: 17 }),
  status: mysqlEnum("status", ["pending", "quoted", "ordered", "completed", "cancelled"]).default("pending").notNull(),
  notes: text("notes"),
  quotedPrice: varchar("quotedPrice", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PartsInquiry = typeof partsInquiries.$inferSelect;
export type InsertPartsInquiry = typeof partsInquiries.$inferInsert;

/**
 * Bookings table - tracks service bookings
 */
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  vehicleId: int("vehicleId"),
  vin: varchar("vin", { length: 17 }),
  serviceType: varchar("serviceType", { length: 100 }).notNull(),
  bookingDate: timestamp("bookingDate").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

/**
 * Facebook Posts table - tracks auto-posted vehicles to Facebook
 */
export const facebookPosts = mysqlTable("facebookPosts", {
  id: int("id").autoincrement().primaryKey(),
  vehicleId: int("vehicleId").notNull(),
  postId: varchar("postId", { length: 255 }),
  imageUrl: text("imageUrl"),
  caption: text("caption"),
  status: mysqlEnum("status", ["draft", "published", "failed"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  publishedAt: timestamp("publishedAt"),
});

export type FacebookPost = typeof facebookPosts.$inferSelect;
export type InsertFacebookPost = typeof facebookPosts.$inferInsert;

/**
 * Vehicle Listings table - stores vehicle listings with images for gallery
 */
export const vehicleListings = mysqlTable("vehicleListings", {
  id: int("id").autoincrement().primaryKey(),
  make: varchar("make", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: int("year"),
  engine: varchar("engine", { length: 100 }),
  transmission: varchar("transmission", { length: 50 }),
  mileage: int("mileage"),
  price: varchar("price", { length: 50 }),
  description: text("description"),
  features: text("features"), // JSON array of features
  imageUrls: text("imageUrls"), // JSON array of image URLs
  primaryImageUrl: text("primaryImageUrl"), // Main image for gallery
  status: mysqlEnum("status", ["active", "sold", "archived"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VehicleListing = typeof vehicleListings.$inferSelect;
export type InsertVehicleListing = typeof vehicleListings.$inferInsert;

/**
 * Listing Images table - stores multiple images for each vehicle listing
 */
export const listingImages = mysqlTable("listingImages", {
  id: int("id").autoincrement().primaryKey(),
  listingId: int("listingId").notNull(),
  imageUrl: text("imageUrl").notNull(),
  displayOrder: int("displayOrder").default(0).notNull(), // Order for image carousel
  isPrimary: int("isPrimary").default(0).notNull(), // 1 if this is the primary image
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ListingImage = typeof listingImages.$inferSelect;
export type InsertListingImage = typeof listingImages.$inferInsert;
