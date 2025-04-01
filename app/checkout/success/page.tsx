import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Confirmed | NextShop",
  description: "Your order has been successfully placed",
};

export default function CheckoutSuccessPage() {
  // Generate a random order number
  const orderNumber = `ORD-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`;

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>

      <p className="text-lg text-muted-foreground mb-8">
        Thank you for your purchase. Your order has been received and is being
        processed.
      </p>

      <div className="bg-muted p-6 rounded-lg mb-8">
        <p className="text-sm text-muted-foreground mb-2">Order Number</p>
        <p className="text-xl font-medium">{orderNumber}</p>
      </div>

      <p className="text-muted-foreground mb-8">
        A confirmation email has been sent to your email address with all the
        details of your order.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/products">Continue Shopping</Link>
        </Button>

        <Button asChild variant="outline" size="lg">
          <Link href="/profile">View Order History</Link>
        </Button>
      </div>
    </div>
  );
}
