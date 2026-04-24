import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  customers,
  vehicles,
  serviceHistory,
  partsInquiries,
  bookings,
  facebookPosts,
  Customer,
  Vehicle,
  ServiceHistory,
  PartsInquiry,
  Booking,
  FacebookPost,
  InsertCustomer,
  InsertVehicle,
  InsertServiceHistory,
  InsertPartsInquiry,
  InsertBooking,
  InsertFacebookPost,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// CRM Queries - Customers
export async function createCustomer(
  data: InsertCustomer
): Promise<Customer | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(customers).values(data);
    const customerId = (result[0] as any).insertId;
    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId as number))
      .limit(1);
    return customer.length > 0 ? customer[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create customer:", error);
    throw error;
  }
}

export async function getCustomerByPhone(phone: string): Promise<Customer | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(customers)
    .where(eq(customers.phone, phone))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getCustomerById(id: number): Promise<Customer | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(customers)
    .where(eq(customers.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllCustomers(): Promise<Customer[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(customers).orderBy(desc(customers.createdAt));
}

// CRM Queries - Vehicles
export async function createVehicle(
  data: InsertVehicle
): Promise<Vehicle | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(vehicles).values(data);
    const vehicleId = (result[0] as any).insertId;
    const vehicle = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, vehicleId as number))
      .limit(1);
    return vehicle.length > 0 ? vehicle[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create vehicle:", error);
    throw error;
  }
}

export async function getVehicleByVin(vin: string): Promise<Vehicle | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.vin, vin))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getVehiclesByCustomerId(
  customerId: number
): Promise<Vehicle[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.customerId, customerId))
    .orderBy(desc(vehicles.createdAt));
}

export async function getVehicleById(id: number): Promise<Vehicle | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllVehicles(): Promise<Vehicle[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
}

// CRM Queries - Service History
export async function createServiceHistory(
  data: InsertServiceHistory
): Promise<ServiceHistory | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(serviceHistory).values(data);
    const historyId = (result[0] as any).insertId;
    const history = await db
      .select()
      .from(serviceHistory)
      .where(eq(serviceHistory.id, historyId as number))
      .limit(1);
    return history.length > 0 ? history[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create service history:", error);
    throw error;
  }
}

export async function getServiceHistoryByCustomerId(
  customerId: number
): Promise<ServiceHistory[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(serviceHistory)
    .where(eq(serviceHistory.customerId, customerId))
    .orderBy(desc(serviceHistory.serviceDate));
}

export async function getServiceHistoryByVehicleId(
  vehicleId: number
): Promise<ServiceHistory[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(serviceHistory)
    .where(eq(serviceHistory.vehicleId, vehicleId))
    .orderBy(desc(serviceHistory.serviceDate));
}

// CRM Queries - Parts Inquiries
export async function createPartsInquiry(
  data: InsertPartsInquiry
): Promise<PartsInquiry | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(partsInquiries).values(data);
    const inquiryId = (result[0] as any).insertId;
    const inquiry = await db
      .select()
      .from(partsInquiries)
      .where(eq(partsInquiries.id, inquiryId as number))
      .limit(1);
    return inquiry.length > 0 ? inquiry[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create parts inquiry:", error);
    throw error;
  }
}

export async function getPartsInquiriesByCustomerId(
  customerId: number
): Promise<PartsInquiry[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(partsInquiries)
    .where(eq(partsInquiries.customerId, customerId))
    .orderBy(desc(partsInquiries.createdAt));
}

export async function getAllPartsInquiries(): Promise<PartsInquiry[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(partsInquiries)
    .orderBy(desc(partsInquiries.createdAt));
}

// CRM Queries - Bookings
export async function createBooking(
  data: InsertBooking
): Promise<Booking | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(bookings).values(data);
    const bookingId = (result[0] as any).insertId;
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId as number))
      .limit(1);
    return booking.length > 0 ? booking[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create booking:", error);
    throw error;
  }
}

export async function getBookingsByCustomerId(
  customerId: number
): Promise<Booking[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(bookings)
    .where(eq(bookings.customerId, customerId))
    .orderBy(desc(bookings.bookingDate));
}

export async function getAllBookings(): Promise<Booking[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(bookings).orderBy(desc(bookings.bookingDate));
}

// CRM Queries - Facebook Posts
export async function createFacebookPost(
  data: InsertFacebookPost
): Promise<FacebookPost | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(facebookPosts).values(data);
    const postId = (result[0] as any).insertId;
    const post = await db
      .select()
      .from(facebookPosts)
      .where(eq(facebookPosts.id, postId as number))
      .limit(1);
    return post.length > 0 ? post[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create Facebook post:", error);
    throw error;
  }
}

export async function getFacebookPostsByVehicleId(
  vehicleId: number
): Promise<FacebookPost[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(facebookPosts)
    .where(eq(facebookPosts.vehicleId, vehicleId))
    .orderBy(desc(facebookPosts.createdAt));
}

// Update customer
export async function updateCustomer(
  id: number,
  data: Partial<InsertCustomer>
): Promise<Customer | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(customers).set(data).where(eq(customers.id, id));
    return await getCustomerById(id);
  } catch (error) {
    console.error("[Database] Failed to update customer:", error);
    throw error;
  }
}

// Delete customer
export async function deleteCustomer(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(customers).where(eq(customers.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete customer:", error);
    throw error;
  }
}

// Update vehicle
export async function updateVehicle(
  id: number,
  data: Partial<InsertVehicle>
): Promise<Vehicle | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(vehicles).set(data).where(eq(vehicles.id, id));
    const result = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, id))
      .limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update vehicle:", error);
    throw error;
  }
}

// Delete vehicle
export async function deleteVehicle(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(vehicles).where(eq(vehicles.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete vehicle:", error);
    throw error;
  }
}

// Update inquiry
export async function updatePartsInquiry(
  id: number,
  data: Partial<InsertPartsInquiry>
): Promise<PartsInquiry | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(partsInquiries).set(data).where(eq(partsInquiries.id, id));
    const result = await db
      .select()
      .from(partsInquiries)
      .where(eq(partsInquiries.id, id))
      .limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update inquiry:", error);
    throw error;
  }
}

// Delete inquiry
export async function deletePartsInquiry(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(partsInquiries).where(eq(partsInquiries.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete inquiry:", error);
    throw error;
  }
}

// Update booking
export async function updateBooking(
  id: number,
  data: Partial<InsertBooking>
): Promise<Booking | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(bookings).set(data).where(eq(bookings.id, id));
    const result = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id))
      .limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update booking:", error);
    throw error;
  }
}

// Delete booking
export async function deleteBooking(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(bookings).where(eq(bookings.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete booking:", error);
    throw error;
  }
}
