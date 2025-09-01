import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createClient()

    // First, find the business by email
    const { data: business, error: findError } = await supabase
      .from("businesses")
      .select("*")
      .eq("email", email)
      .single()

    if (findError || !business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    // Force approve the business
    const { data: updatedBusiness, error: updateError } = await supabase
      .from("businesses")
      .update({ 
        status: "approved",
        updated_at: new Date().toISOString()
      })
      .eq("id", business.id)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating business:", updateError)
      return NextResponse.json({ error: "Failed to approve business" }, { status: 500 })
    }

    console.log("Business approved successfully:", updatedBusiness)

    return NextResponse.json({ 
      success: true, 
      business: updatedBusiness,
      message: "Business approved successfully!"
    })

  } catch (error) {
    console.error("Error in force approve:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


