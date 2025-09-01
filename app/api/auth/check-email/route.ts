import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Check if user exists in the users table
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: "Email not found" },
        { status: 404 }
      )
    }

    // In a real application, you would:
    // 1. Generate a secure reset token
    // 2. Store it in the database with an expiration
    // 3. Send an email with the reset link
    // 4. For now, we'll just return success

    return NextResponse.json(
      { 
        message: "Password reset email sent",
        email: user.email 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error("Error checking email:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


