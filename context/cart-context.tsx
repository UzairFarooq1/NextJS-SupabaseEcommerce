"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getSupabaseBrowser } from "@/lib/supabase/client"

interface CartContextType {
  cartCount: number
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  refreshCart: async () => {},
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0)

  const refreshCart = async () => {
    try {
      const supabase = getSupabaseBrowser()

      // Check if user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setCartCount(0)
        return
      }

      // Get cart items count
      const { count } = await supabase
        .from("cart_items")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.user.id)

      setCartCount(count || 0)
    } catch (error) {
      console.error("Error fetching cart count:", error)
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const supabase = getSupabaseBrowser()

    // Get initial session
    supabase.auth.getSession().then(() => {
      refreshCart()
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refreshCart()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return <CartContext.Provider value={{ cartCount, refreshCart }}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)

