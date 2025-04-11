import { getSupabaseServer } from "@/lib/supabase/server"

export async function getProductById(id: string) {
  const supabase = await getSupabaseServer()

  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return data
}
