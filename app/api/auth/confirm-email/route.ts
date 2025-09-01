import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createClient()

    // For development: Update user to mark email as confirmed
    const { data, error } = await supabase
      .from("users")
      .update({ 
        email_confirmed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("email", email)
      .select()

    if (error) {
      console.error("Error confirming email:", error)
      return NextResponse.json({ error: "Failed to confirm email" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: "Email confirmed successfully",
      user: data?.[0]
    })
  } catch (error) {
    console.error("Error in confirm email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}



