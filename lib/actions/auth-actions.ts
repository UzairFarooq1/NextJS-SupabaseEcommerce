"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

// This function creates a Supabase client specifically for server actions
function getSupabaseAction() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value
        },
        async set(name: string, value: string, options: any) {
          (await cookieStore).set({ name, value, ...options })
        },
        async remove(name: string, options: any) {
          (await cookieStore).set({ name, value: "", ...options })
        },
      },
    },
  )
}

export async function signOut() {
  const supabase = getSupabaseAction()
  await supabase.auth.signOut()
  redirect("/")
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const redirectTo = (formData.get("redirectTo") as string) || "/"

  const supabase = getSupabaseAction()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect(redirectTo)
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const address = formData.get("address") as string
  const phone = formData.get("phone") as string

  const supabase = getSupabaseAction()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        address,
        phone,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

