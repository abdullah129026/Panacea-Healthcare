import { z } from "zod";

const inventoryCategory = z.enum([
  "Pharmaceuticals",
  "Equipment",
  "Supplies",
  "Other",
]);

export const createSupplyOrderSchema = z.object({
  itemName: z.string().min(1, "Item name is required."),
  category: inventoryCategory,
  vendor: z.string().min(1, "Vendor is required."),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
  unitCost: z.coerce
    .number()
    .int("Cost must be in cents.")
    .min(0, "Cost must be positive."),
  currency: z.string().length(3, "Use a 3-letter currency code.").default("USD"),
  notes: z.string().max(500, "Notes are too long.").optional(),
});

export type CreateSupplyOrderInput = z.infer<typeof createSupplyOrderSchema>;
