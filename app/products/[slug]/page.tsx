import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import Image from "next/image";
import AddToCartButton from "@/components/cart/add-to-cart-button";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await getSupabaseServer();

  // Fetch product details
  const { data: product } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("slug", params.slug)
    .single();

  if (!product) {
    notFound();
  }

  // Fetch related products
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("id, name, slug, price, image_url, stock_quantity")
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .limit(4);

  // Check if product is in stock
  const isInStock = product.stock_quantity > 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
          <Image
            src={product.image_url || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {!isInStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="bg-red-500 text-white px-6 py-3 font-bold transform -rotate-45 text-xl w-full text-center">
                OUT OF STOCK
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="mt-2">
            <span className="text-2xl font-semibold">
              Ksh{product.price.toFixed(2)}
            </span>
          </div>

          {product.categories && (
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">Category: </span>
              <span className="text-sm font-medium">
                {product.categories.name}
              </span>
            </div>
          )}

          <div className="mt-4">
            <span className="text-sm text-muted-foreground">
              Availability:{" "}
            </span>
            {isInStock ? (
              <span className="text-sm text-green-600 font-medium">
                In Stock ({product.stock_quantity} available)
              </span>
            ) : (
              <span className="text-sm text-red-600 font-medium">
                Out of Stock
              </span>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">
              {product.description || "No description available."}
            </p>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-4">
              {/* Pass the entire product object instead of just the ID */}
              <AddToCartButton product={product} />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Product Details</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>
                Stock:{" "}
                {isInStock ? `${product.stock_quantity} units` : "Out of stock"}
              </li>
              <li>
                Product ID:{" "}
                {product.id ? String(product.id).substring(0, 8) : "N/A"}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct: any) => {
              const isRelatedInStock = relatedProduct.stock_quantity > 0;
              return (
                <a
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.slug}`}
                  className="group overflow-hidden rounded-lg border border-border p-3 hover:border-primary/50"
                >
                  <div className="aspect-square w-full relative mb-3 bg-muted rounded-md overflow-hidden">
                    <Image
                      src={
                        relatedProduct.image_url ||
                        "/placeholder.svg?height=300&width=300" ||
                        "/placeholder.svg"
                      }
                      alt={relatedProduct.name}
                      className="object-cover transition-transform group-hover:scale-105"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    {!isRelatedInStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="bg-red-500 text-white px-2 py-1 font-bold transform -rotate-45 text-sm w-full text-center">
                          OUT OF STOCK
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium line-clamp-1">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <p className="font-semibold">
                        Ksh{relatedProduct.price.toFixed(2)}
                      </p>
                      {isRelatedInStock ? (
                        <p className="text-xs text-green-600">
                          {relatedProduct.stock_quantity} in stock
                        </p>
                      ) : (
                        <p className="text-xs text-red-600">Out of stock</p>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
