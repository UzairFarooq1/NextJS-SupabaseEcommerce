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
import Link from "next/link";

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

  // Calculate shipping (free over Ksh100)
  const shipping = subtotal >= 100 ? 0 : 10;

  // Calculate total
  const total = subtotal + shipping;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>Ksh{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? "Free" : `KshKsh{shipping.toFixed(2)}`}</span>
        </div>

        <Separator />

        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>Ksh{total.toFixed(2)}</span>
        </div>

        {subtotal < 100 && (
          <p className="text-xs text-muted-foreground mt-2">
            Add Ksh{(100 - subtotal).toFixed(2)} more to qualify for free
            shipping.
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          className="w-full"
          disabled={isCheckingOut || items.length === 0}
          asChild
        >
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Secure checkout with M-Pesa or PayPal
        </p>
      </CardFooter>
    </Card>
  );
}
