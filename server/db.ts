import { eq, and, desc, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  User,
  InsertUser,
  users,
  customers,
  vehicles,
  serviceHistory,
  partsInquiries,
  bookings,
  facebookPosts,
  vehicleListings,
  listingImages,
  products,
  productCategories,
  productImages,
  orders,
  Customer,
  Vehicle,
  ServiceHistory,
  PartsInquiry,
  Booking,
  FacebookPost,
  VehicleListing,
  ListingImage,
  Product,
  ProductCategory,
  ProductImage,
  Order,
  InsertCustomer,
  InsertVehicle,
  InsertServiceHistory,
  InsertPartsInquiry,
  InsertBooking,
  InsertFacebookPost,
  InsertVehicleListing,
  InsertListingImage,
  InsertProduct,
  InsertProductCategory,
  InsertProductImage,
  InsertOrder,
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

    // Handle B2B fields
    if (user.userType !== undefined) {
      values.userType = user.userType;
      updateSet.userType = user.userType;
    }
    if (user.companyName !== undefined) {
      values.companyName = user.companyName ?? null;
      updateSet.companyName = user.companyName ?? null;
    }
    if (user.companyTaxId !== undefined) {
      values.companyTaxId = user.companyTaxId ?? null;
      updateSet.companyTaxId = user.companyTaxId ?? null;
    }
    if (user.b2bApprovalStatus !== undefined) {
      values.b2bApprovalStatus = user.b2bApprovalStatus;
      updateSet.b2bApprovalStatus = user.b2bApprovalStatus;
    }

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


// Vehicle Listings
export async function createVehicleListing(
  data: InsertVehicleListing
): Promise<VehicleListing | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(vehicleListings).values(data);
    const listingId = (result[0] as any).insertId;
    const listing = await db
      .select()
      .from(vehicleListings)
      .where(eq(vehicleListings.id, listingId as number))
      .limit(1);
    return listing.length > 0 ? listing[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create vehicle listing:", error);
    throw error;
  }
}

export async function getVehicleListingById(id: number): Promise<VehicleListing | null> {
  const db = await getDb();
  if (!db) return null;

  const listing = await db
    .select()
    .from(vehicleListings)
    .where(eq(vehicleListings.id, id))
    .limit(1);
  return listing.length > 0 ? listing[0] : null;
}

export async function getAllVehicleListings(): Promise<VehicleListing[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(vehicleListings)
    .where(eq(vehicleListings.status, "active"))
    .orderBy(desc(vehicleListings.createdAt));
}

export async function getVehicleListingsAdmin(): Promise<VehicleListing[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(vehicleListings)
    .orderBy(desc(vehicleListings.createdAt));
}

export async function updateVehicleListing(
  id: number,
  data: Partial<InsertVehicleListing>
): Promise<VehicleListing | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(vehicleListings).set(data).where(eq(vehicleListings.id, id));
    return await getVehicleListingById(id);
  } catch (error) {
    console.error("[Database] Failed to update vehicle listing:", error);
    throw error;
  }
}

export async function deleteVehicleListing(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(vehicleListings).where(eq(vehicleListings.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete vehicle listing:", error);
    throw error;
  }
}

// ============ LISTING IMAGES ============

export async function createListingImage(
  data: InsertListingImage
): Promise<ListingImage | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(listingImages).values(data);
    const imageId = (result[0] as any).insertId;
    const image = await db
      .select()
      .from(listingImages)
      .where(eq(listingImages.id, imageId as number))
      .limit(1);
    return image.length > 0 ? image[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create listing image:", error);
    throw error;
  }
}

export async function getListingImagesByListingId(
  listingId: number
): Promise<ListingImage[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(listingImages)
      .where(eq(listingImages.listingId, listingId))
      .orderBy(listingImages.displayOrder);
  } catch (error) {
    console.error("[Database] Failed to get listing images:", error);
    return [];
  }
}

export async function updateListingImage(
  id: number,
  data: Partial<InsertListingImage>
): Promise<ListingImage | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(listingImages).set(data).where(eq(listingImages.id, id));
    const image = await db
      .select()
      .from(listingImages)
      .where(eq(listingImages.id, id))
      .limit(1);
    return image.length > 0 ? image[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update listing image:", error);
    throw error;
  }
}

export async function deleteListingImage(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(listingImages).where(eq(listingImages.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete listing image:", error);
    throw error;
  }
}

export async function deleteListingImagesByListingId(
  listingId: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(listingImages).where(eq(listingImages.listingId, listingId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete listing images:", error);
    throw error;
  }
}

export async function updateListingImageOrder(
  listingId: number,
  imageIds: number[]
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    for (let i = 0; i < imageIds.length; i++) {
      await db
        .update(listingImages)
        .set({ displayOrder: i })
        .where(eq(listingImages.id, imageIds[i]));
    }
    return true;
  } catch (error) {
    console.error("[Database] Failed to update listing image order:", error);
    throw error;
  }
}


// E-Commerce Queries - Products

export async function createProduct(
  data: InsertProduct
): Promise<Product | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(products).values(data);
    const productId = (result[0] as any).insertId;
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId as number))
      .limit(1);
    return product.length > 0 ? product[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create product:", error);
    throw error;
  }
}

export async function getProducts(filters?: {
  categoryId?: number;
  status?: "active" | "inactive";
  search?: string;
}): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions: any[] = [];
  
  if (filters?.categoryId) {
    conditions.push(eq(products.categoryId, filters.categoryId));
  }
  if (filters?.status) {
    conditions.push(eq(products.status, filters.status));
  }

  const query = conditions.length > 0 
    ? db.select().from(products).where(and(...conditions))
    : db.select().from(products);

  const results = await query;

  // Client-side search filtering
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    return results.filter((p) =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower)
    );
  }

  return results;
}

export async function getProductById(id: number): Promise<Product | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateProduct(
  id: number,
  data: Partial<InsertProduct>
): Promise<Product | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(products).set(data).where(eq(products.id, id));
    return await getProductById(id);
  } catch (error) {
    console.error("[Database] Failed to update product:", error);
    throw error;
  }
}

export async function deleteProduct(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(products).where(eq(products.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete product:", error);
    throw error;
  }
}

// Product Images

export async function getProductImages(productId: number): Promise<ProductImage[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(productImages.displayOrder);
}

export async function createProductImage(
  data: InsertProductImage
): Promise<ProductImage | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(productImages).values(data);
    const imageId = (result[0] as any).insertId;
    const image = await db
      .select()
      .from(productImages)
      .where(eq(productImages.id, imageId as number))
      .limit(1);
    return image.length > 0 ? image[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create product image:", error);
    throw error;
  }
}

export async function deleteProductImage(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(productImages).where(eq(productImages.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete product image:", error);
    throw error;
  }
}

// Categories

export async function getCategories(): Promise<ProductCategory[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(productCategories);
}

export async function getCategoryById(id: number): Promise<ProductCategory | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(productCategories)
    .where(eq(productCategories.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createCategory(
  data: InsertProductCategory
): Promise<ProductCategory | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(productCategories).values(data);
    const categoryId = (result[0] as any).insertId;
    const category = await db
      .select()
      .from(productCategories)
      .where(eq(productCategories.id, categoryId as number))
      .limit(1);
    return category.length > 0 ? category[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create category:", error);
    throw error;
  }
}

// Orders

export async function createOrder(
  data: InsertOrder
): Promise<Order | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(orders).values(data);
    const orderId = (result[0] as any).insertId;
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId as number))
      .limit(1);
    return order.length > 0 ? order[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create order:", error);
    throw error;
  }
}

export async function getOrders(filters?: {
  status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
}): Promise<Order[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions: any[] = [];
  
  if (filters?.status) {
    conditions.push(eq(orders.status, filters.status));
  }

  const query = conditions.length > 0 
    ? db.select().from(orders).where(and(...conditions)).orderBy(desc(orders.createdAt))
    : db.select().from(orders).orderBy(desc(orders.createdAt));

  return await query;
}

export async function getOrderById(id: number): Promise<Order | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateOrder(
  id: number,
  data: Partial<InsertOrder>
): Promise<Order | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const updateData: any = { ...data };
    // Ensure status is a valid enum value if provided
    if (updateData.status && typeof updateData.status === 'string') {
      const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(updateData.status)) {
        throw new Error(`Invalid status: ${updateData.status}`);
      }
    }
    await db.update(orders).set(updateData).where(eq(orders.id, id));
    return await getOrderById(id);
  } catch (error) {
    console.error("[Database] Failed to update order:", error);
    throw error;
  }
}

// B2B User Management

export async function getAllB2BUsers(approvalStatus?: "pending" | "approved" | "rejected"): Promise<User[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions: any[] = [eq(users.userType, "b2b")];
  
  if (approvalStatus) {
    conditions.push(eq(users.b2bApprovalStatus, approvalStatus));
  }

  return await db.select().from(users).where(and(...conditions)).orderBy(desc(users.createdAt));
}

export async function approveB2BUser(userId: number): Promise<User | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(users).set({ b2bApprovalStatus: "approved" }).where(eq(users.id, userId));
    const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to approve B2B user:", error);
    throw error;
  }
}

export async function rejectB2BUser(userId: number): Promise<User | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(users).set({ b2bApprovalStatus: "rejected" }).where(eq(users.id, userId));
    const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to reject B2B user:", error);
    throw error;
  }
}

export async function getUserById(id: number): Promise<User | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateUser(
  id: number,
  data: Partial<User>
): Promise<User | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const updateData: any = { ...data };
    await db.update(users).set(updateData).where(eq(users.id, id));
    return await getUserById(id);
  } catch (error) {
    console.error("[Database] Failed to update user:", error);
    throw error;
  }
}
