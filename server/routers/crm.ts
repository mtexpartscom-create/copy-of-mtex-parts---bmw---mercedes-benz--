/**
 * CRM Router - tRPC procedures for customer relationship management
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { decodeVin, validateVinChecksum } from "../services/vinDecoder";
import { postToFacebook, generateFacebookCaption } from "../services/facebookService";

export const crmRouter = router({
  // ============ CUSTOMERS ============
  customers: router({
    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          phone: z.string().optional(),
          email: z.string().email().optional(),
          address: z.string().optional(),
          city: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const customer = await db.updateCustomer(input.id, input);
          if (!customer) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Customer not found",
            });
          }
          return customer;
        } catch (error) {
          console.error("[CRM] Error updating customer:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update customer",
          });
        }
      }),

    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        try {
          const success = await db.deleteCustomer(input);
          if (!success) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Customer not found",
            });
          }
          return { success: true };
        } catch (error) {
          console.error("[CRM] Error deleting customer:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete customer",
          });
        }
      }),

    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          phone: z.string().min(1, "Phone is required"),
          email: z.string().email().optional(),
          address: z.string().optional(),
          city: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Check if customer already exists by phone
          const existing = await db.getCustomerByPhone(input.phone);
          if (existing) {
            return existing;
          }

          const customer = await db.createCustomer(input);
          if (!customer) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create customer",
            });
          }
          return customer;
        } catch (error) {
          console.error("[CRM] Error creating customer:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create customer",
          });
        }
      }),

    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const customer = await db.getCustomerById(input);
        if (!customer) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Customer not found",
          });
        }
        return customer;
      }),

    list: publicProcedure.query(async () => {
      return await db.getAllCustomers();
    }),
  }),

  // ============ VEHICLES ============
  vehicles: router({
    create: publicProcedure
      .input(
        z.object({
          customerId: z.number(),
          vin: z.string().length(17, "VIN must be 17 characters"),
          make: z.string().optional(),
          model: z.string().optional(),
          year: z.number().optional(),
          engine: z.string().optional(),
          licensePlate: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Check if vehicle already exists
          const existing = await db.getVehicleByVin(input.vin);
          if (existing) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Vehicle with this VIN already exists",
            });
          }

          const vehicle = await db.createVehicle(input);
          if (!vehicle) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create vehicle",
            });
          }
          return vehicle;
        } catch (error) {
          console.error("[CRM] Error creating vehicle:", error);
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create vehicle",
          });
        }
      }),

    getByCustomerId: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getVehiclesByCustomerId(input);
      }),

    getByVin: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        const vehicle = await db.getVehicleByVin(input);
        if (!vehicle) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Vehicle not found",
          });
        }
        return vehicle;
      }),

    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const vehicle = await db.getVehicleById(input);
        if (!vehicle) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Vehicle not found",
          });
        }
        return vehicle;
      }),

    list: publicProcedure.query(async () => {
      return await db.getAllVehicles();
    }),
  }),

  // ============ VIN DECODER ============
  vinDecoder: router({
    decode: publicProcedure
      .input(z.string().length(17, "VIN must be 17 characters"))
      .query(async ({ input }) => {
        try {
          // Validate VIN checksum
          if (!validateVinChecksum(input)) {
            return {
              success: false,
              error: "Invalid VIN checksum",
            };
          }

          const result = await decodeVin(input);
          return result;
        } catch (error) {
          console.error("[VIN Decoder] Error:", error);
          return {
            success: false,
            error: "Failed to decode VIN",
          };
        }
      }),
  }),

  // ============ PARTS INQUIRIES ============
  inquiries: router({
    create: publicProcedure
      .input(
        z.object({
          customerId: z.number(),
          vehicleId: z.number().optional(),
          partName: z.string().min(1, "Part name is required"),
          vin: z.string().optional(),
          status: z.enum(["pending", "quoted", "ordered", "completed", "cancelled"]).optional(),
          notes: z.string().optional(),
          quotedPrice: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const inquiry = await db.createPartsInquiry(input);
          if (!inquiry) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create inquiry",
            });
          }
          return inquiry;
        } catch (error) {
          console.error("[CRM] Error creating inquiry:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create inquiry",
          });
        }
      }),

    getByCustomerId: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getPartsInquiriesByCustomerId(input);
      }),

    list: publicProcedure.query(async () => {
      return await db.getAllPartsInquiries();
    }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "quoted", "ordered", "completed", "cancelled"]).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const inquiry = await db.updatePartsInquiry(input.id, input);
          if (!inquiry) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Inquiry not found",
            });
          }
          return inquiry;
        } catch (error) {
          console.error("[CRM] Error updating inquiry:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update inquiry",
          });
        }
      }),

    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        try {
          const success = await db.deletePartsInquiry(input);
          if (!success) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Inquiry not found",
            });
          }
          return { success: true };
        } catch (error) {
          console.error("[CRM] Error deleting inquiry:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete inquiry",
          });
        }
      }),
  }),

  // ============ BOOKINGS ============
  bookings: router({
    create: publicProcedure
      .input(
        z.object({
          customerId: z.number(),
          vehicleId: z.number().optional(),
          vin: z.string().optional(),
          serviceType: z.string().min(1, "Service type is required"),
          bookingDate: z.date(),
          status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const booking = await db.createBooking(input);
          if (!booking) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create booking",
            });
          }
          return booking;
        } catch (error) {
          console.error("[CRM] Error creating booking:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create booking",
          });
        }
      }),

    getByCustomerId: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getBookingsByCustomerId(input);
      }),

    list: publicProcedure.query(async () => {
      return await db.getAllBookings();
    }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const booking = await db.updateBooking(input.id, input);
          if (!booking) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Booking not found",
            });
          }
          return booking;
        } catch (error) {
          console.error("[CRM] Error updating booking:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update booking",
          });
        }
      }),

    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        try {
          const success = await db.deleteBooking(input);
          if (!success) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Booking not found",
            });
          }
          return { success: true };
        } catch (error) {
          console.error("[CRM] Error deleting booking:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete booking",
          });
        }
      }),
  }),

  // ============ SERVICE HISTORY ============
  serviceHistory: router({
    create: publicProcedure
      .input(
        z.object({
          vehicleId: z.number(),
          customerId: z.number(),
          serviceType: z.string().min(1, "Service type is required"),
          partsUsed: z.string().optional(),
          notes: z.string().optional(),
          serviceDate: z.date().optional(),
          cost: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const history = await db.createServiceHistory(input);
          if (!history) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create service history",
            });
          }
          return history;
        } catch (error) {
          console.error("[CRM] Error creating service history:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create service history",
          });
        }
      }),

    getByCustomerId: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getServiceHistoryByCustomerId(input);
      }),

    getByVehicleId: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getServiceHistoryByVehicleId(input);
      }),
  }),

  // ============ VEHICLE LISTINGS ============
  listings: router({
    create: publicProcedure
      .input(
        z.object({
          make: z.string().min(1, "Make is required"),
          model: z.string().min(1, "Model is required"),
          year: z.number().optional(),
          engine: z.string().optional(),
          transmission: z.string().optional(),
          mileage: z.number().optional(),
          price: z.string().optional(),
          description: z.string().optional(),
          features: z.array(z.string()).optional(),
          imageUrls: z.array(z.string()).optional(),
          primaryImageUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const listing = await db.createVehicleListing({
            ...input,
            features: input.features ? JSON.stringify(input.features) : undefined,
            imageUrls: input.imageUrls ? JSON.stringify(input.imageUrls) : undefined,
          });
          if (!listing) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create listing",
            });
          }
          return listing;
        } catch (error) {
          console.error("[CRM] Error creating listing:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create listing",
          });
        }
      }),

    list: publicProcedure.query(async () => {
      return await db.getAllVehicleListings();
    }),

    listAdmin: publicProcedure.query(async () => {
      return await db.getVehicleListingsAdmin();
    }),

    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getVehicleListingById(input);
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          make: z.string().optional(),
          model: z.string().optional(),
          year: z.number().optional(),
          engine: z.string().optional(),
          transmission: z.string().optional(),
          mileage: z.number().optional(),
          price: z.string().optional(),
          description: z.string().optional(),
          features: z.array(z.string()).optional(),
          imageUrls: z.array(z.string()).optional(),
          primaryImageUrl: z.string().optional(),
          status: z.enum(["active", "sold", "archived"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const { id, ...data } = input;
          const listing = await db.updateVehicleListing(id, {
            ...data,
            features: data.features ? JSON.stringify(data.features) : undefined,
            imageUrls: data.imageUrls ? JSON.stringify(data.imageUrls) : undefined,
          });
          if (!listing) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Listing not found",
            });
          }
          return listing;
        } catch (error) {
          console.error("[CRM] Error updating listing:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update listing",
          });
        }
      }),

    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        try {
          const success = await db.deleteVehicleListing(input);
          if (!success) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Listing not found",
            });
          }
          return { success: true };
        } catch (error) {
          console.error("[CRM] Error deleting listing:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete listing",
          });
        }
      }),
  }),

  // ============ LISTING IMAGES ============
  listingImages: router({
    create: publicProcedure
      .input(
        z.object({
          listingId: z.number(),
          imageUrl: z.string(),
          displayOrder: z.number().default(0),
          isPrimary: z.number().default(0),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const image = await db.createListingImage(input);
          if (!image) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create listing image",
            });
          }
          return image;
        } catch (error) {
          console.error("[CRM] Error creating listing image:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create listing image",
          });
        }
      }),

    getByListingId: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getListingImagesByListingId(input);
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          displayOrder: z.number().optional(),
          isPrimary: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const { id, ...data } = input;
          const image = await db.updateListingImage(id, data);
          if (!image) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Image not found",
            });
          }
          return image;
        } catch (error) {
          console.error("[CRM] Error updating listing image:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update listing image",
          });
        }
      }),

    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        try {
          const success = await db.deleteListingImage(input);
          if (!success) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Image not found",
            });
          }
          return { success: true };
        } catch (error) {
          console.error("[CRM] Error deleting listing image:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete listing image",
          });
        }
      }),

    deleteByListingId: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        try {
          const success = await db.deleteListingImagesByListingId(input);
          if (!success) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Listing not found",
            });
          }
          return { success: true };
        } catch (error) {
          console.error("[CRM] Error deleting listing images:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete listing images",
          });
        }
      }),

    reorder: publicProcedure
      .input(
        z.object({
          listingId: z.number(),
          imageIds: z.array(z.number()),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const success = await db.updateListingImageOrder(
            input.listingId,
            input.imageIds
          );
          if (!success) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to reorder images",
            });
          }
          return { success: true };
        } catch (error) {
          console.error("[CRM] Error reordering listing images:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to reorder images",
          });
        }
      }),
  }),

  // ============ FACEBOOK POSTING ============
  facebook: router({
    generateCaption: publicProcedure
      .input(
        z.object({
          vehicleModel: z.string(),
          engine: z.string(),
          availableParts: z.array(z.string()),
          contactPhone: z.string(),
        })
      )
      .query(({ input }) => {
        return generateFacebookCaption(input);
      }),

    postVehicle: publicProcedure
      .input(
        z.object({
          vehicleModel: z.string(),
          engine: z.string(),
          availableParts: z.array(z.string()),
          contactPhone: z.string(),
          imageUrl: z.string().optional(),
          customCaption: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await postToFacebook(input);
          return result;
        } catch (error) {
          console.error("[CRM] Error posting to Facebook:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to post to Facebook",
          });
        }
      }),
  }),
});

