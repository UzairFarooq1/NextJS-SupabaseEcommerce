import { requireAdmin } from "@/lib/utils/auth";
import { redirect } from "next/navigation";
import { ProductForm } from "@/components/product-form";
import { Shell } from "@/components/shell";
import { getProductById } from "@/lib/db/products";
import StockManagement from "@/components/admin/stock-management";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  params: {
    id: string;
  };
}

export default async function ProductEditPage({ params }: Props) {
  // Ensure user is admin
  await requireAdmin();

  // Get product data
  const product = await getProductById(params.id);

  if (!product) {
    redirect("/admin/products");
  }

  return (
    <Shell>
      <ProductForm initialValues={product} />
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Stock Management</CardTitle>
          <CardDescription>Update product stock quantity</CardDescription>
        </CardHeader>
        <CardContent>
          <StockManagement
            product={product}
            onUpdate={() => {
              // This will be handled by the client component
            }}
          />
        </CardContent>
      </Card>
    </Shell>
  );
}
