import { getSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

export default async function OrdersPage() {
  const supabase = getSupabaseServer();

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin?redirect=/profile/orders");
  }

  // Fetch orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

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

      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      {orders && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap justify-between items-center">
                  <CardTitle className="text-lg">
                    Order #{order.id.substring(0, 8)}
                  </CardTitle>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Placed on {format(new Date(order.created_at), "MMMM d, yyyy")}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Total Amount
                    </p>
                    <p className="font-medium">
                      ${Number(order.total_amount).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Payment Method
                    </p>
                    <p className="font-medium capitalize">
                      {order.payment_method}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Payment Status
                    </p>
                    <p className="font-medium capitalize">
                      {order.payment_status}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <Button asChild>
                      <Link href={`/profile/orders/${order.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              You haven't placed any orders yet.
            </p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
