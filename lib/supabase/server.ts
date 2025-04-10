import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export const getSupabaseServer = async () => {
  try {
    const cookieStore = cookies()

    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            try {
              return (await cookieStore).get(name)?.value
            } catch (error) {
              // This handles the case during static generation
              console.error(`Error getting cookie ${name}:`, error)
              return undefined
            }
          },
          async set(name: string, value: string, options: any) {
            try {
              (await cookieStore).set({ name, value, ...options })
            } catch (error) {
              console.error(`Error setting cookie ${name}:`, error)
            }
          },
          async remove(name: string, options: any) {
            try {
              (await cookieStore).set({ name, value: "", ...options })
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
            single: async () => ({ data: null, error: null }),
            limit: async () => ({ data: [], error: null }),
          }),
          limit: async () => ({ data: [], error: null }),
          order: () => ({
            limit: async () => ({ data: [], error: null }),
          }),
        }),
      }),
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
      },
    } as any
  }
}
