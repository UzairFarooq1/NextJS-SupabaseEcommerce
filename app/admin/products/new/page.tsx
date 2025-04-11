import { requireAdmin } from "@/lib/utils/auth";
import { ProductForm } from "@/components/product-form";
import { Shell } from "@/components/shell";

export default async function NewProductPage() {
  // Ensure user is admin
  await requireAdmin();

  return (
    <Shell>
      <ProductForm />
    </Shell>
  );
}
