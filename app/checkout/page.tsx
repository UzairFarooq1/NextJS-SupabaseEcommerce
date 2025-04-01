import { getSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout/checkout-form";
import OrderSummary from "@/components/checkout/order-summary";

export const metadata: Metadata = {
  title: "Checkout | NextShop",
  description: "Complete your purchase securely",
};

export default async function CheckoutPage() {
  const supabase = getSupabaseServer();

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin?redirect=/checkout");
  }

  // Fetch cart items with product details
  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("*, products(*)")
    .eq("user_id", session.user.id);

  // Fetch user profile for pre-filling checkout form
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  // If cart is empty, redirect to cart page
  if (!cartItems || cartItems.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <CheckoutForm profile={profile} />
        </div>

        <div>
          <OrderSummary items={cartItems} />
        </div>
      </div>
    </div>
  );
}
