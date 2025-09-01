import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessId, updates } = body

    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Update business details
    const { data, error } = await supabase
      .from("businesses")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", businessId)
      .select()
      .single()

    if (error) {
      console.error("Error updating business:", error)
      return NextResponse.json({ error: "Failed to update business" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      business: data
    })
  } catch (error) {
    console.error("Error in business update PATCH:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}



