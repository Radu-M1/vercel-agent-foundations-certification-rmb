import { tool } from "ai";
import { z } from "zod";

import { ApiRequestError, getCategories, getProducts } from "@/lib/api";

export const searchProducts = tool({
  description: `
    Search the Vercel swag store product catalog.

    Use this whenever the user asks about products, what the store sells,
    product availability, or wants recommendations.

    Optionally narrow the results to a single category.
  `,

  inputSchema: z.object({
    query: z
      .string()
      .optional()
      .describe(
        "Optional free-text search terms describing what the user is looking for, such as 'hoodie' or 'water bottle'.",
      ),

    category: z
      .string()
      .optional()
      .describe(
        "Optional category slug used to filter results. Only set this when the user clearly wants a specific category. Use the getAllCategories tool to retrieve valid categories.",
      ),
  }),

  execute: async ({ query, category }) => {
    try {
      const products = await getProducts({
        search: query,
        category,
        limit: 10,
      });

      return {
        count: products.length,

        products: products.map((product) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images[0] ?? null,
          price: product.price,
          currency: product.currency,
          category: product.category,
          description: product.description,
        })),
      };
    } catch (error) {
      const message =
        error instanceof ApiRequestError ? error.message : "Unknown error";

      return {
        count: 0,
        products: [],
        error: message,
      };
    }
  },
});

export const getAllCategories = tool({
  description: `
    List every product category available in the Vercel swag store,
    along with the number of products in each category.

    Use this when the user asks what categories exist, what kinds of
    products are sold, or wants to browse the store at a high level.
  `,

  inputSchema: z.object({}),

  execute: async () => {
    try {
      const categories = await getCategories();

      return {
        count: categories.length,

        categories: categories.map((category) => ({
          slug: category.slug,
          name: category.name,
          productCount: category.productCount,
        })),
      };
    } catch (error) {
      const message =
        error instanceof ApiRequestError ? error.message : "Unknown error";

      return {
        count: 0,
        categories: [],
        error: message,
      };
    }
  },
});
