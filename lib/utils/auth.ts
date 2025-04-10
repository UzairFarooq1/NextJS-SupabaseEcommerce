import { getSupabaseServer } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function requireAdmin() {
  const supabase = await getSupabaseServer()
  
  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  if (!session) {
    redirect("/auth/signin?redirect=/admin")
  }
  
  // Check if user is an admin
  const { data: userRole } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single()
  
  if (!userRole || userRole.role !== "admin") {
    redirect("/")
  }
  
  return session.user
}
