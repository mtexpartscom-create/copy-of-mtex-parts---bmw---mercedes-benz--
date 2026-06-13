/**
 * Listings Router - tRPC procedures for vehicle parts listings management
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { storagePut } from "../storage";

// Admin-only procedure
const adminProcedure = publicProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const listingsRouter = router({
  // Get all listings with optional filters
  getAll: publicProcedure
    .input(
      z.object({
        status: z.enum(["active", "sold", "archived"]).optional(),
        make: z.string().optional(),
        model: z.string().optional(),
        yearFrom: z.number().optional(),
        yearTo: z.number().optional(),
        priceFrom: z.string().optional(),
        priceTo: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        return await db.getAllVehicleListings();
      } catch (error) {
        console.error("[Listings] Error fetching listings:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch listings",
        });
      }
    }),

  // Get single listing by ID
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      try {
        const listing = await db.getVehicleListingById(input);
        if (!listing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Listing not found",
          });
        }
        return listing;
      } catch (error) {
        console.error("[Listings] Error fetching listing:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch listing",
        });
      }
    }),

  // Create new listing (admin only)
  create: adminProcedure
    .input(
      z.object({
        make: z.string().min(1, "Make is required"),
        model: z.string().min(1, "Model is required"),
        year: z.number().optional(),
        engine: z.string().optional(),
        transmission: z.string().optional(),
        mileage: z.number().optional(),
        price: z.string().min(1, "Price is required"),
        description: z.string().optional(),
        features: z.string().optional(),
        imageUrls: z.string(), // JSON stringified array
        primaryImageUrl: z.string(),
        status: z.enum(["active", "sold", "archived"]).default("active"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const listing = await db.createVehicleListing({
          make: input.make,
          model: input.model,
          year: input.year,
          engine: input.engine,
          transmission: input.transmission,
          mileage: input.mileage,
          price: input.price,
          description: input.description,
          features: input.features,
          imageUrls: input.imageUrls,
          primaryImageUrl: input.primaryImageUrl,
          status: input.status,
        });

        if (!listing) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create listing",
          });
        }

        return listing;
      } catch (error) {
        console.error("[Listings] Error creating listing:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create listing",
        });
      }
    }),

  // Update listing (admin only)
  update: adminProcedure
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
        features: z.string().optional(),
        imageUrls: z.string().optional(),
        primaryImageUrl: z.string().optional(),
        status: z.enum(["active", "sold", "archived"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input;
        const listing = await db.updateVehicleListing(id, updateData);

        if (!listing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Listing not found",
          });
        }

        return listing;
      } catch (error) {
        console.error("[Listings] Error updating listing:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update listing",
        });
      }
    }),

  // Delete listing (admin only)
  delete: adminProcedure
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
        console.error("[Listings] Error deleting listing:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete listing",
        });
      }
    }),

  // Upload image for listing (admin only)
  uploadImage: adminProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileData: z.instanceof(Buffer),
        mimeType: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Generate a unique file name
        const timestamp = Date.now();
        const uniqueFileName = `listings/${timestamp}-${input.fileName}`;

        // Upload to storage
        const { url, key } = await storagePut(
          uniqueFileName,
          input.fileData,
          input.mimeType || "image/jpeg"
        );

        return {
          url,
          key,
        };
      } catch (error) {
        console.error("[Listings] Error uploading image:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload image",
        });
      }
    }),

  // Get listing images
  getImages: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      try {
        return await db.getListingImagesByListingId(input);
      } catch (error) {
        console.error("[Listings] Error fetching images:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch images",
        });
      }
    }),

  // Update image display order (admin only)
  updateImageOrder: adminProcedure
    .input(
      z.object({
        listingId: z.number(),
        images: z.array(
          z.object({
            id: z.number(),
            displayOrder: z.number(),
            isPrimary: z.number().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      try {
        for (const image of input.images) {
          await db.updateListingImage(image.id, {
            displayOrder: image.displayOrder,
            isPrimary: image.isPrimary ?? 0,
          });
        }
        return { success: true };
      } catch (error) {
        console.error("[Listings] Error updating image order:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update image order",
        });
      }
    }),

  // Delete listing image (admin only)
  deleteImage: adminProcedure
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
        console.error("[Listings] Error deleting image:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete image",
        });
      }
    }),
});
