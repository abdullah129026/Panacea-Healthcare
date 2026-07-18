"use server";

import { revalidatePath } from "next/cache";
import type { InventoryItem } from "@/types";
import { serverApi } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import { createSupplyOrderSchema } from "@/lib/schemas";
import { fieldErrorsFromZod, type FormState } from "@/lib/forms";

/** Roles permitted to create supply orders. */
const INVENTORY_WRITE_ROLES = ["admin"] as const;

export async function createSupplyOrder(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireRole(INVENTORY_WRITE_ROLES);

  const parsed = createSupplyOrderSchema.safeParse({
    itemName: formData.get("itemName"),
    category: formData.get("category"),
    vendor: formData.get("vendor"),
    quantity: formData.get("quantity"),
    unitCost: formData.get("unitCost"),
    currency: formData.get("currency"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const result = await serverApi.post<InventoryItem>("/inventory/orders", {
    body: parsed.data,
  });

  if (!result.success) {
    return { error: result.error };
  }

  revalidatePath("/inventory");
  return { success: true, message: "Supply order created successfully." };
}
