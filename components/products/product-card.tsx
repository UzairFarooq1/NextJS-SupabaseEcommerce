import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import AddToCartButton from "@/components/cart/add-to-cart-button";

interface ProductCardProps {
  product: any;
  cartQuantity?: number;
}

export default function ProductCard({
  product,
  cartQuantity = 0,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="aspect-square overflow-hidden bg-muted relative">
          {product.image_url ? (
            <>
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                width={300}
                height={300}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
              {cartQuantity > 0 && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  {cartQuantity}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No image</p>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
        </Link>
        {product.categories && (
          <p className="text-xs text-muted-foreground mt-1">
            {product.categories.name}
          </p>
        )}
        <p className="mt-2 font-semibold">Ksh{product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <AddToCartButton product={product} variant="secondary" />
      </CardFooter>
    </Card>
  );
}
