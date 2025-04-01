"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"

export default function ProductFilters({
  categories,
}: {
  categories: { id: string; name: string; slug: string }[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Get current filter values from URL
  const currentCategory = searchParams.get("category") || ""
  const minPrice = searchParams.get("minPrice") || "0"
  const maxPrice = searchParams.get("maxPrice") || "1000"

  // Local state for price range
  const [priceRange, setPriceRange] = useState<[number, number]>([Number.parseInt(minPrice), Number.parseInt(maxPrice)])

  // Apply filters
  const applyFilters = (params: Record<string, string | null>) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams.toString())

      // Update or remove each parameter
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newParams.delete(key)
        } else {
          newParams.set(key, value)
        }
      })

      // Preserve search query if it exists
      const search = searchParams.get("search")
      if (search) {
        newParams.set("search", search)
      }

      router.push(`/products?${newParams.toString()}`)
    })
  }

  // Handle category selection
  const handleCategoryChange = (slug: string) => {
    applyFilters({
      category: currentCategory === slug ? null : slug,
    })
  }

  // Handle price filter
  const handlePriceChange = () => {
    applyFilters({
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
    })
  }

  // Reset all filters
  const resetFilters = () => {
    setPriceRange([0, 1000])
    applyFilters({
      category: null,
      minPrice: null,
      maxPrice: null,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters} disabled={isPending}>
          Reset
        </Button>
      </div>

      <Accordion type="single" collapsible defaultValue="category">
        <AccordionItem value="category">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.slug}`}
                    checked={currentCategory === category.slug}
                    onCheckedChange={() => handleCategoryChange(category.slug)}
                  />
                  <Label htmlFor={`category-${category.slug}`} className="text-sm font-normal cursor-pointer">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                min={0}
                max={1000}
                step={10}
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />

              <div className="flex items-center justify-between">
                <div className="grid gap-2">
                  <Label htmlFor="min-price">Min</Label>
                  <Input
                    id="min-price"
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                    className="w-24"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="max-price">Max</Label>
                  <Input
                    id="max-price"
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                    className="w-24"
                  />
                </div>
              </div>

              <Button onClick={handlePriceChange} size="sm" className="w-full" disabled={isPending}>
                Apply
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

