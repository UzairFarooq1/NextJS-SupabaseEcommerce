import { getSupabaseServer } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default async function FeaturedCategories() {
  const supabase = getSupabaseServer()

  const { data: categories } = await supabase.from("categories").select("name, slug").limit(4)

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.slug} href={`/products?category=${category.slug}`}>
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <p className="text-lg font-medium text-muted-foreground">{category.name}</p>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

