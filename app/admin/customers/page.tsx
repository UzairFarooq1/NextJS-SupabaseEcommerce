import { getSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const supabase = await getSupabaseServer();

  const page = Number(searchParams.page) || 1;
  const pageSize = 10;
  const search = searchParams.search || "";

  // Build query
  let query = supabase.from("users").select("*", { count: "exact" });

  // Apply filters
  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Execute query
  const { data: customers, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  // Fetch order data for all customers in one query
  const customerIds = customers?.map((customer: any) => customer.id) || [];

  // Get order counts and total spent for each customer
  const { data: customerOrders } =
    customerIds.length > 0
      ? await supabase
          .from("orders")
          .select("user_id, total_amount")
          .in("user_id", customerIds)
      : { data: [] };

  // Create a map of customer stats
  const customerStats: Record<
    string,
    { orderCount: number; totalSpent: number }
  > = {};

  // Initialize stats for all customers
  if (customers) {
    customers.forEach((customer: any) => {
      customerStats[customer.id] = { orderCount: 0, totalSpent: 0 };
    });
  }

  // Update stats with actual order data
  if (customerOrders) {
    customerOrders.forEach((order: any) => {
      if (customerStats[order.user_id]) {
        customerStats[order.user_id].orderCount++;
        customerStats[order.user_id].totalSpent += Number(order.total_amount);
      }
    });
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Manage your customer accounts</p>
      </div>

      <form
        className="flex flex-col sm:flex-row gap-4 items-end"
        action="/admin/customers"
        method="GET"
      >
        <div className="grid w-full sm:max-w-sm items-center gap-1.5">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            name="search"
            placeholder="Search by name or email..."
            defaultValue={search}
          />
        </div>

        <Button type="submit">Search</Button>
      </form>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers && customers.length > 0 ? (
              customers.map((customer: any) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {customer.full_name
                            ? customer.full_name.charAt(0).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {customer.full_name || "Unknown"}
                        </div>
                        {customer.phone && (
                          <div className="text-xs text-muted-foreground">
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    {format(new Date(customer.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {customerStats[customer.id]?.orderCount > 0 ? (
                      <Link
                        href={`/admin/orders?customer=${customer.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {customerStats[customer.id].orderCount}{" "}
                        {customerStats[customer.id].orderCount === 1
                          ? "Order"
                          : "Orders"}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">No orders</span>
                    )}
                  </TableCell>
                  <TableCell>
                    ${customerStats[customer.id]?.totalSpent.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/customers/${customer.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground"
                >
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                asChild
              >
                <Link
                  href={{
                    pathname: "/admin/customers",
                    query: {
                      ...searchParams,
                      page: pageNum,
                    },
                  }}
                >
                  {pageNum}
                </Link>
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
}
