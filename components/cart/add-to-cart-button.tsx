"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { getSupabaseBrowser } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"

interface AddToCartButtonProps {
  product: any
  variant?: "default" | "secondary" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function AddToCartButton({ product, variant = "default", size = "default" }: AddToCartButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { refreshCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = async () => {
    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowser()

      // Check if user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        // Redirect to login if not authenticated
        router.push(`/auth/signin?redirect=/products/${product.slug}`)
        return
      }

      // Check if product is already in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("product_id", product.id)
        .single()

      if (existingItem) {
        // Update quantity if already in cart
        await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id)
      } else {
        // Add new item to cart
        await supabase.from("cart_items").insert({
          user_id: session.user.id,
          product_id: product.id,
          quantity: 1,
        })
      }

      // Show success animation
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)

      // Show toast
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })

      // Refresh cart count
      refreshCart()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleAddToCart} variant={variant} size={size} disabled={isLoading} className="w-full">
      {isAdded ? (
        <>
          <Check className="mr-2 h-4 w-4" /> Added
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </>
      )}
    </Button>
  )
}

