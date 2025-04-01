import { getSupabaseServer } from "@/lib/supabase/server";
import ProductCard from "@/components/products/product-card";
import ProductFilters from "@/components/products/product-filters";
import ProductSearch from "@/components/products/product-search";
import { Suspense } from "react";
import { getUserCartItems } from "@/lib/cart";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
  };
}) {
  const supabase = getSupabaseServer();

  // Fetch categories for filter
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug");

  // Fetch user's cart items
  const cartItems = await getUserCartItems();

  // Create a map of product_id to quantity for easy lookup
  const cartItemsMap = cartItems.reduce((acc, item) => {
    acc[item.product_id] = item.quantity;
    return acc;
  }, {} as Record<string, number>);

  // Build query with filters
  let query = supabase.from("products").select("*, categories(name, slug)");

  // Apply category filter
  if (searchParams.category) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", searchParams.category)
      .single();

    if (categoryData) {
      query = query.eq("category_id", categoryData.id);
    }
  }

  // Apply price filters
  if (searchParams.minPrice) {
    query = query.gte("price", Number.parseFloat(searchParams.minPrice));
  }

  if (searchParams.maxPrice) {
    query = query.lte("price", Number.parseFloat(searchParams.maxPrice));
  }

  // Apply search
  if (searchParams.search) {
    query = query.ilike("name", `%${searchParams.search}%`);
  }

  // Execute query
  const { data: products } = await query;

  // Get the maximum price from the current product set
  const maxPrice =
    products && products.length > 0
      ? Math.max(...products.map((product) => Number(product.price)))
      : 1000; // Default to 1000 if no products or prices

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <ProductFilters
            categories={categories || []}
            maxProductPrice={maxPrice}
          />
        </div>

        <div className="w-full md:w-3/4">
          <ProductSearch />

          <Suspense fallback={<div>Loading products...</div>}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {products?.length ? (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    cartQuantity={cartItemsMap[product.id] || 0}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your filters or search term
                  </p>
                </div>
              )}
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
