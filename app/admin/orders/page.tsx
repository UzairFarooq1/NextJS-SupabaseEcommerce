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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; status?: string };
}) {
  const supabase = getSupabaseServer();

  const page = Number(searchParams.page) || 1;
  const pageSize = 10;
  const search = searchParams.search || "";
  const statusFilter = searchParams.status || "";

  // Build query
  let query = supabase.from("orders").select(
    `
      *,
      users (
        id,
        full_name,
        email
      )
    `,
    { count: "exact" }
  );

  // Apply filters
  if (search) {
    query = query.or(
      `users.full_name.ilike.%${search}%,users.email.ilike.%${search}%`
    );
  }

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Execute query
  const { data: orders, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="grid w-full sm:max-w-sm items-center gap-1.5">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by customer name or email..."
            defaultValue={search}
          />
        </div>

        <div className="grid w-full sm:max-w-sm items-center gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Select defaultValue={statusFilter || "all"}>
            <SelectTrigger id="status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit">Filter</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    #{order.id.substring(0, 8)}
                  </TableCell>
                  <TableCell>
                    {order.users?.full_name || "Unknown"}
                    <div className="text-xs text-muted-foreground">
                      {order.users?.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    ${Number(order.total_amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="capitalize">
                    <div>{order.payment_method}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {order.payment_status}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/orders/${order.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-muted-foreground"
                >
                  No orders found
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
                    pathname: "/admin/orders",
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
