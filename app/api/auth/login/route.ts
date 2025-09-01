import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    const supabase = createClient()

    // For development: Check if user exists in our database
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (userError || !user) {
      return NextResponse.json({ 
        error: "Invalid email or password. Please check your credentials." 
      }, { status: 401 })
    }

    // For development: Simple password check (in production, use proper hashing)
    // Since we don't store passwords in the users table, we'll use a simple check
    if (password === "Password.2018" || password === "admin123") {
      // Success - return user data
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      })
    } else {
      return NextResponse.json({ 
        error: "Invalid email or password. Please check your credentials." 
      }, { status: 401 })
    }

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}



