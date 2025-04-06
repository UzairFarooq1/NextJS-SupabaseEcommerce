"use client";

import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

export default function TopSellingProducts({ products }: { products: any[] }) {
  // Find the maximum quantity to calculate percentages
  const maxQuantity =
    products.length > 0
      ? Math.max(...products.map((item) => item.quantity))
      : 0;

  return (
    <div className="space-y-4">
      {products.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No product data available
        </div>
      ) : (
        products.map((item) => {
          const product = item.products;
          const percentage =
            maxQuantity > 0 ? (item.quantity / maxQuantity) * 100 : 0;

          return (
            <div key={item.product_id} className="flex items-center gap-4">
              <div className="w-12 h-12 relative rounded-md overflow-hidden bg-muted flex-shrink-0">
                {product.image_url ? (
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-xs text-muted-foreground">No image</p>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="text-sm font-medium truncate hover:underline"
                >
                  {product.name}
                </Link>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-muted-foreground">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <span className="text-sm font-medium">
                    {item.quantity} sold
                  </span>
                </div>
                <Progress value={percentage} className="h-1 mt-2" />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
