import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getSupabaseServer } from "@/lib/supabase/server";
import HeroCarousel from "@/components/hero-carousel";

export default async function Home() {
  const supabase = await getSupabaseServer();

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false })
    .limit(4);

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .limit(5);

  return (
    <div className="flex flex-col gap-12 py-6 w-full max-w-7xl mx-auto">
      {/* Hero carousel section */}
      <section className="w-full px-4 md:px-6">
        <HeroCarousel />
      </section>

      {/* Featured categories */}
      <section className="w-full px-4 md:px-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories?.map((category: any) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="aspect-square w-full bg-muted relative">
                  <Image
                    src={
                      category.image_url ||
                      "/placeholder.svg?height=300&width=300"
                    }
                    alt={category.name}
                    className="object-cover transition-transform group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                    <h3 className="text-xl font-semibold text-white">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="w-full px-4 md:px-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts?.map((product: any) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group overflow-hidden rounded-lg border border-border p-3 hover:border-primary/50"
              >
                <div className="aspect-square w-full relative mb-3 bg-muted rounded-md overflow-hidden">
                  <Image
                    src={
                      product.image_url ||
                      "/placeholder.svg?height=300&width=300"
                    }
                    alt={product.name}
                    className="object-cover transition-transform group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <div>
                  <h3 className="font-medium line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {product.categories?.name}
                  </p>
                  <p className="font-semibold mt-2">
                    Ksh{product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Link href="/products">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Promotional banner */}
      <section className="w-full px-4 md:px-6">
        <div className="relative overflow-hidden rounded-lg">
          <div className="aspect-[21/9] w-full relative">
            <Image
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200"
              alt="Special Offer"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">
              Special Offer
            </h2>
            <p className="text-lg md:text-xl mb-4 md:mb-6 max-w-md">
              Get 20% off on your first purchase. Use code WELCOME20 at
              checkout.
            </p>
            <Link href="/products">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90"
              >
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
