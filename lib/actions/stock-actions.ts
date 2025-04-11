"use server"

import { getSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Checks if all items in the cart are in stock with the requested quantities
 */
export async function checkStockAvailability(cartItems: any[]) {
  const supabase = await getSupabaseServer()

  // Get all product IDs from cart
  const productIds = cartItems.map((item) => item.product_id)

  // Fetch current stock levels for all products in cart
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, stock_quantity")
    .in("id", productIds)

  if (error) {
    throw new Error(`Failed to check stock: ${error.message}`)
  }

  // Create a map of product ID to stock quantity
  const stockMap = products.reduce((map :any, product:any) => {
    map[product.id] = {
      name: product.name,
      stock: product.stock_quantity,
    }
    return map
  }, {})

  // Check if any item exceeds available stock
  const outOfStockItems = cartItems.filter((item) => {
    const product = stockMap[item.product_id]
    return !product || product.stock < item.quantity
  })

  if (outOfStockItems.length > 0) {
    const itemNames = outOfStockItems
      .map((item) => {
        const product = stockMap[item.product_id]
        if (!product) return "Unknown product"
        return `${product.name} (requested: ${item.quantity}, available: ${product.stock})`
      })
      .join(", ")

    throw new Error(`Some items are out of stock: ${itemNames}`)
  }

  return true
}

/**
 * Reduces stock quantities after an order is placed
 */
export async function reduceStockQuantities(orderItems: any[]) {
  const supabase = await getSupabaseServer()

  for (const item of orderItems) {
    // Update stock quantity for each product
    const { error } = await supabase
      .from("products")
      .update({
        stock_quantity: supabase.rpc("decrement_stock", {
          product_id: item.product_id,
          quantity: item.quantity,
        }),
      })
      .eq("id", item.product_id)

    if (error) {
      throw new Error(`Failed to update stock for product ${item.product_id}: ${error.message}`)
    }
  }

  // Revalidate product pages to reflect new stock levels
  revalidatePath("/products")
  revalidatePath("/admin/products")
}
