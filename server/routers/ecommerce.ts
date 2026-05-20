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

export const ecommerceRouter = router({
  // Product procedures
  products: router({
    // Get all products with optional filters
    getAll: publicProcedure
      .input(
        z.object({
          categoryId: z.number().optional(),
          status: z.string().optional(),
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
          status: z.string().optional(),
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
});
