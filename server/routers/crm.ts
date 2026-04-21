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
