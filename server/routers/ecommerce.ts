/**
 * E-Commerce Router
 * Product catalog and order management procedures
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductImages,
  createProductImage,
  deleteProductImage,
  getCategories,
  getCategoryById,
  createCategory,
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
} from "../db";
import { TRPCError } from "@trpc/server";
import { getCities, getOfficesByCity, calculateShippingCost } from "../_core/ekont";

export const ecommerceRouter = router({
  // Product procedures
  products: router({
    // Get all products with optional filters
    getAll: publicProcedure
      .input(
        z.object({
          categoryId: z.number().optional(),
          status: z.enum(["active", "inactive"]).optional(),
          search: z.string().optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        try {
          const products = await getProducts({
            categoryId: input?.categoryId,
            status: input?.status || "active",
            search: input?.search,
          });
          return products;
        } catch (error) {
          console.error("Error fetching products:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch products",
          });
        }
      }),

    // Get single product with images
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input: productId }) => {
        try {
          const product = await getProductById(productId);
          if (!product) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Product not found",
            });
          }

          const images = await getProductImages(productId);
          return {
            ...product,
            images,
          };
        } catch (error) {
          console.error("Error fetching product:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch product",
          });
        }
      }),

    // Create product (admin only)
    create: protectedProcedure
      .input(
        z.object({
          categoryId: z.number(),
          name: z.string().min(1),
          description: z.string().optional(),
          price: z.string().min(1),
          stock: z.number().default(0),
          compatibleBrands: z.string().optional(),
          compatibleModels: z.string().optional(),
          specifications: z.string().optional(),
          primaryImageUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          if (ctx.user?.role !== "admin") {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Only admins can create products",
            });
          }

          const product = await createProduct({
            categoryId: input.categoryId,
            name: input.name,
            description: input.description,
            price: input.price,
            stock: input.stock,
            compatibleBrands: input.compatibleBrands,
            compatibleModels: input.compatibleModels,
            specifications: input.specifications,
            primaryImageUrl: input.primaryImageUrl,
            status: "active",
          });

          return product;
        } catch (error) {
          console.error("Error creating product:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create product",
          });
        }
      }),

    // Update product (admin only)
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          categoryId: z.number().optional(),
          name: z.string().optional(),
          description: z.string().optional(),
          price: z.string().optional(),
          stock: z.number().optional(),
          compatibleBrands: z.string().optional(),
          compatibleModels: z.string().optional(),
          specifications: z.string().optional(),
          primaryImageUrl: z.string().optional(),
          status: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          if (ctx.user?.role !== "admin") {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Only admins can update products",
            });
          }

          const product = await updateProduct(input.id, {
            categoryId: input.categoryId,
            name: input.name,
            description: input.description,
            price: input.price,
            stock: input.stock,
            compatibleBrands: input.compatibleBrands,
            compatibleModels: input.compatibleModels,
            specifications: input.specifications,
            primaryImageUrl: input.primaryImageUrl,
            status: input.status as any,
          });

          return product;
        } catch (error) {
          console.error("Error updating product:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update product",
          });
        }
      }),

    // Delete product (admin only)
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input: productId, ctx }) => {
        try {
          if (ctx.user?.role !== "admin") {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Only admins can delete products",
            });
          }

          const success = await deleteProduct(productId);
          return { success };
        } catch (error) {
          console.error("Error deleting product:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete product",
          });
        }
      }),
  }),

  // Product images
  productImages: router({
    getByProductId: publicProcedure
      .input(z.number())
      .query(async ({ input: productId }) => {
        try {
          return await getProductImages(productId);
        } catch (error) {
          console.error("Error fetching product images:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch images",
          });
        }
      }),

    create: protectedProcedure
      .input(
        z.object({
          productId: z.number(),
          imageUrl: z.string(),
          displayOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          if (ctx.user?.role !== "admin") {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Only admins can add images",
            });
          }

          return await createProductImage({
            productId: input.productId,
            imageUrl: input.imageUrl,
            displayOrder: input.displayOrder,
          });
        } catch (error) {
          console.error("Error creating product image:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create image",
          });
        }
      }),

    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input: imageId, ctx }) => {
        try {
          if (ctx.user?.role !== "admin") {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Only admins can delete images",
            });
          }

          const success = await deleteProductImage(imageId);
          return { success };
        } catch (error) {
          console.error("Error deleting product image:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete image",
          });
        }
      }),
  }),

  // Categories
  categories: router({
    getAll: publicProcedure.query(async () => {
      try {
        return await getCategories();
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch categories",
        });
      }
    }),

    getById: publicProcedure
      .input(z.number())
      .query(async ({ input: categoryId }) => {
        try {
          return await getCategoryById(categoryId);
        } catch (error) {
          console.error("Error fetching category:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch category",
          });
        }
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          slug: z.string().min(1),
          description: z.string().optional(),
          parentCategoryId: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          if (ctx.user?.role !== "admin") {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Only admins can create categories",
            });
          }

          return await createCategory({
            name: input.name,
            slug: input.slug,
            description: input.description,
            parentCategoryId: input.parentCategoryId,
          });
        } catch (error) {
          console.error("Error creating category:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create category",
          });
        }
      }),
  }),

  // Orders
  orders: router({
    // Get all orders (admin only)
    getAll: protectedProcedure
      .input(
        z.object({
          status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]).optional(),
        }).optional()
      )
      .query(async ({ input, ctx }) => {
        try {
          if (ctx.user?.role !== "admin") {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Only admins can view orders",
            });
          }

          return await getOrders({
            status: input?.status,
          });
        } catch (error) {
          console.error("Error fetching orders:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch orders",
          });
        }
      }),

    // Get single order
    getById: protectedProcedure
      .input(z.number())
      .query(async ({ input: orderId, ctx }) => {
        try {
          if (ctx.user?.role !== "admin") {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Only admins can view orders",
            });
          }

          const order = await getOrderById(orderId);
          if (!order) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Order not found",
            });
          }

          return order;
        } catch (error) {
          console.error("Error fetching order:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch order",
          });
        }
      }),

    // Create order (public)
    create: publicProcedure
      .input(
        z.object({
          customerName: z.string().min(1),
          customerPhone: z.string().min(1),
          customerEmail: z.string().email().optional(),
          econtOffice: z.string().min(1),
          items: z.string(), // JSON string of items
          totalPrice: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const order = await createOrder({
            customerName: input.customerName,
            customerPhone: input.customerPhone,
            customerEmail: input.customerEmail,
            econtOffice: input.econtOffice,
            items: input.items,
            totalPrice: input.totalPrice,
            status: "pending",
          });

          return order;
        } catch (error) {
          console.error("Error creating order:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create order",
          });
        }
      }),

    // Update order status (admin only)
    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          if (ctx.user?.role !== "admin") {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Only admins can update orders",
            });
          }

          const order = await updateOrder(input.id, {
            status: input.status,
          });

          return order;
        } catch (error) {
          console.error("Error updating order:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update order",
          });
        }
      }),
  }),

  // B2B Management
  b2b: router({
    // Register as B2B (protected)
    register: protectedProcedure
      .input(
        z.object({
          userType: z.enum(["b2c", "b2b"]),
          companyName: z.string().min(1).optional(),
          companyTaxId: z.string().min(1).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          if (!ctx.user?.id) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "User not authenticated",
            });
          }

          // Update user with B2B info
          const { updateUser } = await import("../db");
          const updated = await updateUser(ctx.user.id, {
            userType: input.userType,
            companyName: input.companyName || null,
            companyTaxId: input.companyTaxId || null,
            b2bApprovalStatus: input.userType === "b2b" ? "pending" : undefined,
          });

          return updated;
        } catch (error) {
          console.error("Error registering B2B user:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to register B2B user",
          });
        }
      }),

    // Get all B2B users (admin only)
    getAllUsers: protectedProcedure
      .input(
        z.object({
          approvalStatus: z.enum(["pending", "approved", "rejected"]).optional(),
        }).optional()
      )
      .query(async ({ input, ctx }) => {
        try {
          if (ctx.user?.role !== "admin") {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Only admins can view B2B users",
            });
          }

          const { getAllB2BUsers } = await import("../db");
          return await getAllB2BUsers(input?.approvalStatus);
        } catch (error) {
          console.error("Error fetching B2B users:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch B2B users",
          });
        }
      }),

    // Approve B2B user (admin only)
    approve: protectedProcedure
      .input(z.number())
      .mutation(async ({ input: userId, ctx }) => {
        try {
          if (ctx.user?.role !== "admin") {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Only admins can approve B2B users",
            });
          }

          const { approveB2BUser } = await import("../db");
          return await approveB2BUser(userId);
        } catch (error) {
          console.error("Error approving B2B user:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to approve B2B user",
          });
        }
      }),

    // Reject B2B user (admin only)
    reject: protectedProcedure
      .input(z.number())
      .mutation(async ({ input: userId, ctx }) => {
        try {
          if (ctx.user?.role !== "admin") {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Only admins can reject B2B users",
            });
          }

          const { rejectB2BUser } = await import("../db");
          return await rejectB2BUser(userId);
        } catch (error) {
          console.error("Error rejecting B2B user:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to reject B2B user",
          });
        }
      }),
  }),

  // Ekont Shipping
  ekont: router({
    // Get all cities
    getCities: publicProcedure.query(async () => {
      try {
        return await getCities();
      } catch (error) {
        console.error("Error fetching Ekont cities:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch cities",
        });
      }
    }),

    // Get offices for a city
    getOffices: publicProcedure
      .input(z.string())
      .query(async ({ input: cityId }) => {
        try {
          return await getOfficesByCity(cityId);
        } catch (error) {
          console.error("Error fetching Ekont offices:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch offices",
          });
        }
      }),

    // Calculate shipping cost
    calculateShipping: publicProcedure
      .input(
        z.object({
          cityId: z.string(),
          weight: z.number().default(1),
        })
      )
      .query(async ({ input }) => {
        try {
          const cost = await calculateShippingCost(input.cityId, input.weight);
          return { cost };
        } catch (error) {
          console.error("Error calculating shipping:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to calculate shipping",
          });
        }
      }),
  }),
});
