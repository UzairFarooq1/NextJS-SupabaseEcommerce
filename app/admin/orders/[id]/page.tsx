import { getSupabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/utils/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import OrderStatusForm from "@/components/admin/order-status-form";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();
  const supabase = await getSupabaseServer();

  // Fetch order details
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .single();

  let userData = null;
  if (order) {
    const { data: user } = await supabase
      .from("users")
      .select("id, full_name, email, phone")
      .eq("id", order.user_id)
      .single();

    userData = user;
  }

  // And modify the order object to include user data
  if (order && userData) {
    order.users = userData;
  }

  if (orderError || !order) {
    console.error("Error fetching order:", orderError);
    notFound();
  }

  // Fetch order items with product details
  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select("*, products(*)")
    .eq("order_id", order.id);

  if (itemsError || !orderItems) {
    console.error("Error fetching order items:", itemsError);
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

  // Calculate order summary
  const subtotal = orderItems.reduce((sum: number, item: any) => {
    return sum + Number(item.price_at_purchase) * item.quantity;
  }, 0);

  const tax = Number(order.total_amount) - subtotal;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button asChild variant="ghost" className="pl-0">
            <Link href="/admin/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
        </div>
        <Badge className={getStatusColor(order.status)}>
          {formatStatus(order.status)}
        </Badge>
      </div>

      <div>
        <h1 className="text-3xl font-bold">
          Order #{order.id.substring(0, 8)}
        </h1>
        <p className="text-muted-foreground">
          Placed on {format(new Date(order.created_at), "MMMM d, yyyy")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="font-medium">
                {order.users?.full_name || "Unknown"}
              </p>
              <p>{order.users?.email}</p>
              {order.users?.phone && <p>{order.users.phone}</p>}
              <div className="pt-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/customers/${order.users?.id}`}>
                    View Customer
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-medium capitalize">
                  {order.payment_method}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium capitalize">
                  {order.payment_status}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">
                  Ksh{Number(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="whitespace-pre-line">{order.shipping_address}</p>
              {order.tracking_number && (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    Tracking Number:
                  </p>
                  <p className="font-medium">{order.tracking_number}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
                      <p className="text-xs text-muted-foreground">No image</p>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <Link
                    href={`/admin/products/${item.products.id}`}
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
                    {(Number(item.price_at_purchase) * item.quantity).toFixed(
                      2
                    )}
                  </p>
                </div>
              </div>
            ))}

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>Ksh{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>Ksh{tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>Ksh{Number(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderStatusForm order={order} />
        </CardContent>
      </Card>
    </div>
  );
}
