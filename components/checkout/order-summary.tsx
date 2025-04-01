"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  items: any[];
}

export default function OrderSummary({ items }: OrderSummaryProps) {
  // Calculate order totals
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });

  useEffect(() => {
    // Calculate subtotal
    const subtotal = items.reduce((total, item) => {
      return total + item.products.price * item.quantity;
    }, 0);

    // Calculate shipping (free over Ksh100)
    const shipping = subtotal >= 100 ? 0 : 10;

    // Calculate tax (assume 10% for example)
    const tax = subtotal * 0.1;

    // Calculate total
    const total = subtotal + shipping + tax;

    setOrderSummary({
      subtotal,
      shipping,
      tax,
      total,
    });
  }, [items]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="w-16 h-16 relative rounded-md overflow-hidden bg-muted flex-shrink-0">
                {item.products.image_url ? (
                  <Image
                    src={item.products.image_url || "/placeholder.svg"}
                    alt={item.products.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-xs text-muted-foreground">No image</p>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <p className="font-medium">{item.products.name}</p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity}
                </p>
                <p className="font-medium mt-1">
                  Ksh{(item.products.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>Ksh{orderSummary.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>
              {orderSummary.shipping === 0
                ? "Free"
                : `KshKsh{orderSummary.shipping.toFixed(2)}`}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (10%)</span>
            <span>Ksh{orderSummary.tax.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>Ksh{orderSummary.total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
