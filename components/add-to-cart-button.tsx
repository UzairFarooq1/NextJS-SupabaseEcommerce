"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddToCartButtonProps {
  productId: string;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = getSupabaseBrowser();

  const addToCart = async () => {
    setIsLoading(true);

    try {
      // Check if user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to add items to your cart.",
          variant: "destructive",
        });
        router.push("/signin");
        return;
      }

      const userId = session.user.id;

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .single();

      if (existingItem) {
        // Update quantity if item exists
        const { error } = await supabase
          .from("cart_items")
          .update({
            quantity: existingItem.quantity + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingItem.id);

        if (error) throw error;
      } else {
        // Insert new item if it doesn't exist
        const { error } = await supabase.from("cart_items").insert({
          user_id: userId,
          product_id: productId,
          quantity: 1,
        });

        if (error) throw error;
      }

      toast({
        title: "Added to cart",
        description: "Item has been added to your cart.",
      });

      router.refresh();
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
      onClick={addToCart}
      disabled={isLoading}
      className="w-full md:w-auto"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
