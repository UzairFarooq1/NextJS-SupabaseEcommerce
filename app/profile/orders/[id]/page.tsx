export const dynamic = "force-dynamic";

import { getSupabaseServer } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package } from "lucide-react";

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await getSupabaseServer();

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin?redirect=/profile/orders/" + params.id);
  }

  // Fetch order details and ensure it belongs to the current user
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", session.user.id) // Important: Only allow access to the user's own orders
    .single();

  if (!order) {
    notFound();
  }

  // Fetch order items with product details
  const { data: orderItems } = await supabase
    .from("order_items")
    .select("*, products(*)")
    .eq("order_id", order.id);

  if (!orderItems) {
    notFound();
  }

  // Format status for display
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="ghost" className="pl-0">
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <Badge className={getStatusColor(order.status)}>
          {formatStatus(order.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Order Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{order.id}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Placed on {format(new Date(order.created_at), "MMMM d, yyyy")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium capitalize">{order.payment_method}</p>
            <p className="text-sm text-muted-foreground mt-1 capitalize">
              Status: {order.payment_status}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Shipping
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order.tracking_number ? (
              <>
                <p className="font-medium">Tracking: {order.tracking_number}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Carrier: Standard Shipping
                </p>
              </>
            ) : (
              <div className="flex items-center text-muted-foreground">
                <Package className="mr-2 h-4 w-4" />
                <span>
                  Tracking information will appear here when your order ships
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderItems.map((item: any) => (
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
                          <p className="text-xs text-muted-foreground">
                            No image
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <Link
                        href={`/products/${item.products.slug}`}
                        className="font-medium hover:underline"
                      >
                        {item.products.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-medium mt-1">
                        Ksh{Number(item.price_at_purchase).toFixed(2)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">
                        Ksh
                        {(
                          Number(item.price_at_purchase) * item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>Ksh{(Number(order.total_amount) * 0.9).toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>Ksh{(Number(order.total_amount) * 0.1).toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>Ksh{Number(order.total_amount).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm">
                {order.shipping_address}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button asChild variant="outline">
          <Link href="/profile">Back to Profile</Link>
        </Button>
      </div>
    </div>
  );
}
