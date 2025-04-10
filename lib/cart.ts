import { getSupabaseServer } from "@/lib/supabase/server"

export async function getUserCartItems() {
  const supabase = await getSupabaseServer()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return []
  }

  // Get cart items for the current user
  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("product_id, quantity")
    .eq("user_id", session.user.id)

  return cartItems || []
}

