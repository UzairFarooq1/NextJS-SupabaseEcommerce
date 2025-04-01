import { getSupabaseServer } from "@/lib/supabase/server"
import ProductCard from "@/components/products/product-card"

export default async function RelatedProducts({
  currentProductId,
  categoryId,
}: {
  currentProductId: string
  categoryId: string | null
}) {
  const supabase = getSupabaseServer()

  let query = supabase.from("products").select("*, categories(name, slug)").neq("id", currentProductId).limit(4)

  if (categoryId) {
    query = query.eq("category_id", categoryId)
  }

  const { data: relatedProducts } = await query

  if (!relatedProducts || relatedProducts.length === 0) {
    return null
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

