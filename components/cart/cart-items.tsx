"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Minus, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/cart-context";

export default function CartItems({ items: initialItems }: { items: any[] }) {
  const { toast } = useToast();
  const { refreshCart } = useCart();
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setIsUpdating((prev) => ({ ...prev, [itemId]: true }));

    try {
      const supabase = getSupabaseBrowser();

      await supabase.from("cart_items").update({ quantity }).eq("id", itemId);

      // Update local state immediately
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );

      // Refresh global cart state
      refreshCart();

      // Refresh server data
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update quantity.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId: string) => {
    setIsUpdating((prev) => ({ ...prev, [itemId]: true }));

    try {
      const supabase = getSupabaseBrowser();

      await supabase.from("cart_items").delete().eq("id", itemId);

      // Update local state immediately
      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemId)
      );

      // Refresh global cart state
      refreshCart();

      // Refresh server data
      router.refresh();

      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  // The rest of the component remains the same, but we'll use our local items state
  return (
    <div className="space-y-6">
      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Your cart is empty</p>
        </div>
      ) : (
        items.map((item) => (
          <div key={item.id} className="flex gap-4 py-4 border-b">
            <div className="w-24 h-24 relative rounded-md overflow-hidden bg-muted">
              {item.products.image_url ? (
                <Image
                  src={item.products.image_url || "/placeholder.svg"}
                  alt={item.products.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-xs text-muted-foreground">No image</p>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col">
              <Link
                href={`/products/${item.products.slug}`}
                className="font-medium hover:underline"
              >
                {item.products.name}
              </Link>

              <p className="text-sm text-muted-foreground mt-1">
                Ksh{item.products.price.toFixed(2)}
              </p>

              <div className="flex items-center gap-2 mt-auto">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={isUpdating[item.id] || item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>

                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, Number.parseInt(e.target.value))
                  }
                  className="h-8 w-16 text-center"
                  disabled={isUpdating[item.id]}
                />

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={isUpdating[item.id]}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                disabled={isUpdating[item.id]}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <p className="font-medium">
                Ksh{(item.products.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
