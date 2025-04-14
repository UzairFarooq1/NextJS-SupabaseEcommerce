"use server"

import { getSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Processes an order and updates stock quantities
 */
export async function processOrder(orderData: {
  userId: string
  items: Array<{ productId: number; quantity: number }>
  shippingAddress: string
  paymentMethod: string
  totalAmount: number
}) {
  const supabase = await getSupabaseServer()

  try {
    console.log("Processing order with data:", JSON.stringify(orderData, null, 2))

    // 1. Create the order - MODIFIED to avoid users table lookup
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: orderData.userId,
        status: "processing",
        total_amount: orderData.totalAmount,
        shipping_address: orderData.shippingAddress,
        payment_method: orderData.paymentMethod,
        payment_status: "paid",
      })
      .select()
      .single()

    if (orderError) {
      console.error("Order creation error:", orderError)
      throw new Error(orderError.message || "Failed to create order")
    }

    console.log("Order created successfully:", order.id)

    // 2. Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price_at_purchase: 0, // This will be updated with actual price
    }))

    // Get product prices
    const productIds = orderData.items.map((item) => item.productId)
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, price")
      .in("id", productIds)

    if (productsError) {
      console.error("Error fetching product prices:", productsError)
      throw new Error(productsError.message || "Failed to fetch product prices")
    }

    // Update prices in order items
    if (products) {
      const priceMap = products.reduce(
        (map : any, product:any) => {
          map[product.id] = product.price
          return map
        },
        {} as Record<number, number>,
      )

      orderItems.forEach((item) => {
        item.price_at_purchase = priceMap[item.product_id] || 0
      })
    }

    console.log("Creating order items:", orderItems)
    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      throw new Error(itemsError.message || "Failed to create order items")
    }

    // 3. Update stock quantities - MODIFIED to use direct update instead of RPC
    console.log("Updating stock quantities...")
    for (const item of orderData.items) {
      // Get current stock
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", item.productId)
        .single()

      if (productError) {
        console.error(`Error fetching product ${item.productId}:`, productError)
        throw new Error(`Failed to fetch product ${item.productId}: ${productError.message}`)
      }

      if (!product) {
        console.error(`Product ${item.productId} not found`)
        throw new Error(`Product ${item.productId} not found`)
      }

      // Calculate new stock level
      const newStockLevel = Math.max(0, product.stock_quantity - item.quantity)

      console.log(`Updating product ${item.productId} stock: ${product.stock_quantity} -> ${newStockLevel}`)

      // Update stock directly
      const { error: updateError } = await supabase
        .from("products")
        .update({ stock_quantity: newStockLevel })
        .eq("id", item.productId)

      if (updateError) {
        console.error(`Error updating stock for product ${item.productId}:`, updateError)
        throw new Error(`Failed to update stock for product ${item.productId}: ${updateError.message}`)
      }
    }

    // 4. Clear cart - MODIFIED to use a direct delete without checking user
    console.log("Clearing cart for user:", orderData.userId)
    const { error: cartError } = await supabase.from("cart_items").delete().eq("user_id", orderData.userId)

    if (cartError) {
      console.error("Error clearing cart:", cartError)
      // Don't throw here, just log the error
    }

    // 5. Revalidate relevant paths
    revalidatePath("/products")
    revalidatePath("/cart")

    return { success: true, orderId: order.id }
  } catch (error: any) {
    console.error("Error processing order:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}
