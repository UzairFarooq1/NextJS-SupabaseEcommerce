import { getSupabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/utils/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  ShoppingBag,
  Package,
} from "lucide-react";
import RecentOrdersTable from "@/components/admin/recent-orders-table";
import SalesChart from "@/components/admin/sales-chart";
import TopSellingProducts from "@/components/admin/top-selling-products";

export default async function AdminDashboard() {
  // Ensure user is admin
  const adminUser = await requireAdmin();

  const supabase = await getSupabaseServer();

  // Debug: Log the current user
  console.log("Admin user:", adminUser);

  // Fetch statistics
  const { data: orderStats, error: orderStatsError } = await supabase
    .from("orders")
    .select("id, total_amount, status, created_at");

  // Debug: Log order stats query result
  console.log("Order stats query result:", { orderStats, orderStatsError });

  // Use the correct type for count queries
  const { data: productData, count: productCount } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true });

  const { data: userData, count: userCount } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true });

  // Calculate statistics
  const totalOrders = orderStats?.length || 0;
  const totalRevenue =
    orderStats?.reduce(
      (sum: number, order: { total_amount: any }) =>
        sum + Number(order.total_amount),
      0
    ) || 0;
  const pendingOrders =
    orderStats?.filter(
      (order: { status: string }) => order.status === "pending"
    ).length || 0;

  // Get recent orders with user details - try a simpler query first
  const { data: recentOrders, error: recentOrdersError } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  // Debug: Log recent orders query result
  console.log("Recent orders query result:", {
    recentOrders,
    recentOrdersError,
  });

  // If we got orders, now try to get user details
  const ordersWithUsers = [];
  if (recentOrders && recentOrders.length > 0) {
    // Get user details for each order
    for (const order of recentOrders) {
      const { data: userData } = await supabase
        .from("users")
        .select("full_name, email")
        .eq("id", order.user_id)
        .single();

      ordersWithUsers.push({
        ...order,
        users: userData,
      });
    }
  }

  // Debug: Log orders with users
  console.log("Orders with users:", ordersWithUsers);

  // Get top selling products
  const { data: topProducts } = await supabase
    .from("order_items")
    .select(
      `
      product_id,
      quantity,
      products (
        id,
        name,
        price,
        image_url
      )
    `
    )
    .limit(5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your store performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Ksh {totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                +12.5% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                +8.2% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                +5.0% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              new products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 inline-flex items-center">
                -2.5% <ArrowDownRight className="h-3 w-3 ml-1" />
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Display any errors */}
      {(orderStatsError || recentOrdersError) && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {orderStatsError && (
            <p>Error fetching order stats: {orderStatsError.message}</p>
          )}
          {recentOrdersError && (
            <p>Error fetching recent orders: {recentOrdersError.message}</p>
          )}
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>
                  Sales performance for the past 30 days
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <SalesChart />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Your best performing products</CardDescription>
              </CardHeader>
              <CardContent>
                <TopSellingProducts products={topProducts || []} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest orders from your customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentOrdersTable
                orders={
                  ordersWithUsers.length > 0
                    ? ordersWithUsers
                    : recentOrders || []
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Detailed performance metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded">
                <p className="text-muted-foreground">
                  Advanced analytics coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and download reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded">
                <p className="text-muted-foreground">
                  Reports feature coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
