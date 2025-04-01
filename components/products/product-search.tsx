"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function ProductSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Get current search query from URL
  const currentSearch = searchParams.get("search") || ""
  const [searchQuery, setSearchQuery] = useState(currentSearch)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (searchQuery) {
        params.set("search", searchQuery)
      } else {
        params.delete("search")
      }

      router.push(`/products?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <Input
        type="search"
        placeholder="Search products..."
        className="w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0" disabled={isPending}>
        <Search className="h-4 w-4" />
      </Button>
    </form>
  )
}

