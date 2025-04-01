"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CartSummary({ items: initialItems }: { items: any[] }) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [items, setItems] = useState(initialItems);

  // Update local state when props change
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Calculate subtotal
  const subtotal = items.reduce(
    (total, item) => total + item.products.price * item.quantity,
    0
  );

  // Calculate shipping (free over $100)
  const shipping = subtotal >= 100 ? 0 : 10;

  // Calculate total
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // In a real app, you would redirect to checkout page or process payment
    setTimeout(() => {
      setIsCheckingOut(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>

        <Separator />

        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {subtotal < 100 && (
          <p className="text-xs text-muted-foreground mt-2">
            Add ${(100 - subtotal).toFixed(2)} more to qualify for free
            shipping.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleCheckout}
          disabled={isCheckingOut || items.length === 0}
        >
          {isCheckingOut ? "Processing..." : "Checkout"}
        </Button>
      </CardFooter>
    </Card>
  );
}
