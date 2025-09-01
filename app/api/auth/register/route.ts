import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

// For development: Auto-confirm email to bypass email confirmation
const autoConfirmEmail = async (email: string) => {
  try {
    const supabase = createClient()
    // This is a development workaround - in production, users should confirm their email
    const { data, error } = await supabase.auth.admin.updateUserById(
      email, // This should be user ID, but we'll handle this differently
      { email_confirm: true }
    )
    return { data, error }
  } catch (error) {
    console.log("Auto-confirmation not available in development")
    return { data: null, error }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone, role, businessData } = body

    const supabase = createClient()

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .single()

    if (existingUser) {
      return NextResponse.json({ 
        error: "An account with this email already exists. Please use a different email or try logging in." 
      }, { status: 409 })
    }

    // For development: Create user directly without auth confirmation
    const userId = crypto.randomUUID()
    
    // Create user profile directly
    const { error: userError } = await supabase.from("users").insert({
      id: userId,
      email,
      name,
      phone,
      role,
      email_verified: true, // Auto-verify for development
      phone_verified: false,
    })

    if (userError) {
      console.error("Error creating user profile:", userError)
      
      // Handle duplicate email error specifically
      if (userError.code === '23505' && userError.message.includes('email')) {
        return NextResponse.json({ 
          error: "An account with this email already exists. Please use a different email or try logging in." 
        }, { status: 409 })
      }
      
      return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 })
    }



    // Create business if role is business_owner
    if (role === "business_owner" && businessData) {
      const { error: businessError } = await supabase.from("businesses").insert({
        owner_id: userId,
        name: businessData.name,
        description: businessData.description || "No description provided",
        email,
        phone,
        address: businessData.address || "",
        city: businessData.city || "",
        status: "pending",
      })

      if (businessError) {
        console.error("Error creating business registration:", businessError)
        return NextResponse.json({ error: "Failed to register business" }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email,
        name,
        role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
