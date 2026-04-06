import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lotologic-web.y0hzq4.easypanel.host"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const redirect = searchParams.get("redirect") || "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${appUrl}${redirect}`)
    }
  }

  // Auth error — redirect to login
  return NextResponse.redirect(`${appUrl}/login?error=auth_failed`)
}
