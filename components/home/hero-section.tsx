import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Discover Our Latest Collection
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Shop the newest trends and find your perfect style. Quality products at affordable prices.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/products?category=featured">Featured Items</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-full overflow-hidden rounded-xl bg-muted md:h-[450px]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
              <div className="flex h-full items-center justify-center">
                <p className="text-xl font-medium text-muted-foreground">Hero Image</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

