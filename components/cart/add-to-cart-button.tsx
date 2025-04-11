"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/cart-context";

interface AddToCartButtonProps {
  product: any;
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}

export default function AddToCartButton({
  product,
  variant = "default",
  size = "default",
  disabled = false,
}: AddToCartButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { refreshCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Check if product is in stock
  const isInStock = product.stock_quantity > 0;
  const isDisabled = disabled || !isInStock || isLoading;

  // Update the handleAddToCart function to check stock before adding to cart

  const handleAddToCart = async () => {
    // Don't proceed if the product is out of stock
    if (!isInStock) {
      toast({
        title: "Out of stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const supabase = getSupabaseBrowser();

      // Check if user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Redirect to login if not authenticated
        router.push(`/auth/signin?redirect=/products/${product.slug}`);
        return;
      }

      // Get the latest stock information
      const { data: currentProduct } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", product.id)
        .single();

      if (!currentProduct || currentProduct.stock_quantity <= 0) {
        toast({
          title: "Out of stock",
          description: `${product.name} is currently out of stock.`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Check if product is already in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("product_id", product.id)
        .single();

      // Check if adding more would exceed available stock
      if (
        existingItem &&
        existingItem.quantity + 1 > currentProduct.stock_quantity
      ) {
        toast({
          title: "Stock limit reached",
          description: `Cannot add more of this item. Only ${currentProduct.stock_quantity} available.`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (existingItem) {
        // Update quantity if already in cart
        await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id);
      } else {
        // Add new item to cart
        await supabase.from("cart_items").insert({
          user_id: session.user.id,
          product_id: product.id,
          quantity: 1,
        });
      }

      // Show success animation
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);

      // Show toast
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });

      // Refresh cart count
      refreshCart();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      variant={variant}
      size={size}
      disabled={isDisabled}
      className="w-full"
    >
      {isAdded ? (
        <>
          <Check className="mr-2 h-4 w-4" /> Added
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {!isInStock ? "Out of Stock" : "Add to Cart"}
        </>
      )}
    </Button>
  );
}
