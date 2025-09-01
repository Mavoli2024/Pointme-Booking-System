import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // In a real application, you would:
    // 1. Verify the reset token is valid and not expired
    // 2. Find the user associated with the token
    // 3. Update the user's password
    // 4. Invalidate the reset token

    // For now, we'll simulate this process
    // You would typically have a password_reset_tokens table
    
    // Simulate finding user by token (in real app, you'd query a tokens table)
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", "user@example.com") // This would come from the token
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }

    // Update the user's password
    const { error: updateError } = await supabase
      .from("users")
      .update({ 
        password: password, // In real app, hash this password
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("Error updating password:", updateError)
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    )

  } catch (error) {
    console.error("Error resetting password:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


