import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export const getSupabaseServer = async () => {
  try {
    // Await the cookies() function to resolve the Promise
    const cookieStore = await cookies()

    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            try {
              return cookieStore.get(name)?.value
            } catch (error) {
              console.error(`Error getting cookie ${name}:`, error)
              return undefined
            }
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              console.error(`Error setting cookie ${name}:`, error)
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: "", ...options })
            } catch (error) {
              console.error(`Error removing cookie ${name}:`, error)
            }
          },
        },
      },
    )
  } catch (error) {
    console.error("Error creating Supabase server client:", error)
    // Return a dummy client that won't crash but will log errors
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error("Supabase client creation failed") }),
            limit: async () => ({ data: null, error: new Error("Supabase client creation failed") }),
          }),
          limit: async () => ({ data: null, error: new Error("Supabase client creation failed") }),
          order: () => ({
            limit: async () => ({ data: null, error: new Error("Supabase client creation failed") }),
          }),
        }),
      }),
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
      },
    } as any
  }
}