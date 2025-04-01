import Image from "next/image";
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";

export default async function ProductList({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = getSupabaseServer();

  // Extract filter parameters
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;
  const category =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;
  const minPrice =
    typeof searchParams.minPrice === "string"
      ? Number.parseFloat(searchParams.minPrice)
      : undefined;
  const maxPrice =
    typeof searchParams.maxPrice === "string"
      ? Number.parseFloat(searchParams.maxPrice)
      : undefined;
  const sort =
    typeof searchParams.sort === "string" ? searchParams.sort : "name-asc";

  // Build query
  let query = supabase.from("products").select("*, categories(name, slug)");

  // Apply filters
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (category) {
    query = query.eq("categories.slug", category);
  }

  if (minPrice !== undefined) {
    query = query.gte("price", minPrice);
  }

  if (maxPrice !== undefined) {
    query = query.lte("price", maxPrice);
  }

  // Apply sorting
  const [sortField, sortDirection] = sort.split("-");
  query = query.order(sortField === "price" ? "price" : "name", {
    ascending: sortDirection === "asc",
  });

  // Execute query
  const { data: products, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return <div>Error loading products. Please try again later.</div>;
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          className="group overflow-hidden rounded-lg border border-border p-3 hover:border-primary/50"
        >
          <div className="aspect-square w-full relative mb-3 bg-muted rounded-md overflow-hidden">
            <Image
              src={product.image_url || "/placeholder.svg?height=300&width=300"}
              alt={product.name}
              className="object-cover transition-transform group-hover:scale-105"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div>
            <h3 className="font-medium line-clamp-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {product.categories?.name}
            </p>
            <p className="font-semibold mt-2">Ksh{product.price.toFixed(2)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
