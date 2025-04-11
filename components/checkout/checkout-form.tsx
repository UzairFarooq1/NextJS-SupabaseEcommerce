"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { useCart } from "@/context/cart-context";
import MpesaPayment from "./mpesa-payment";
import PaypalPayment from "./paypal-payment";

export default function CheckoutForm({
  profile,
  cartItems,
}: {
  profile: any;
  cartItems: any[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { refreshCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    city: "",
    country: "",
    postalCode: "",
    saveInfo: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const supabase = getSupabaseBrowser();

      // If user chose to save info, update their profile
      if (formData.saveInfo) {
        await supabase
          .from("users")
          .update({
            full_name: formData.fullName,
            address: formData.address,
            phone: formData.phone,
          })
          .eq("id", profile.id);
      }

      // Calculate order total
      const subtotal = cartItems.reduce((total, item) => {
        return total + item.products.price * item.quantity;
      }, 0);

      const shipping = subtotal >= 100 ? 0 : 10;
      const tax = subtotal * 0.1;
      const total = subtotal + shipping + tax;

      // Create full shipping address
      const shippingAddress = `${formData.fullName}\n${formData.address}\n${formData.city}, ${formData.postalCode}\n${formData.country}\nPhone: ${formData.phone}`;

      // Create order record
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: profile.id,
          status: "pending",
          total_amount: total,
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
          payment_status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.products.id,
        quantity: item.quantity,
        price_at_purchase: item.products.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Process payment based on selected method
      // This would be handled by the payment components

      // For demo purposes, we'll simulate a successful payment
      await supabase
        .from("orders")
        .update({
          status: "processing",
          payment_status: "paid",
        })
        .eq("id", order.id);

      // Clear cart
      await supabase.from("cart_items").delete().eq("user_id", profile.id);

      // Refresh cart
      refreshCart();

      // Redirect to success page
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process payment.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
            <CardDescription>Enter your shipping details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="saveInfo"
                name="saveInfo"
                checked={formData.saveInfo}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="saveInfo" className="text-sm font-normal">
                Save this information for next time
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              Select your preferred payment method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              defaultValue="mpesa"
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mpesa" id="mpesa" />
                <Label htmlFor="mpesa" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  M-Pesa
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
                    P
                  </div>
                  PayPal
                </Label>
              </div>
            </RadioGroup>

            <div className="mt-6">
              <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                <TabsContent value="mpesa" className="mt-4">
                  <MpesaPayment isProcessing={isProcessing} />
                </TabsContent>

                <TabsContent value="paypal" className="mt-4">
                  <PaypalPayment isProcessing={isProcessing} />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Complete Order"}
        </Button>
      </div>
    </form>
  );
}
