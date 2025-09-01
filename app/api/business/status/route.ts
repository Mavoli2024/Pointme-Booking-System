import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    
    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Get business by user email
    const { data: business, error } = await supabase
      .from("businesses")
      .select(`
        id,
        name,
        status,
        users (email)
      `)
      .eq("users.email", email)
      .single()

    if (error) {
      console.error("Error fetching business status:", error)
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    return NextResponse.json({ 
      business: {
        id: business.id,
        name: business.name,
        status: business.status
      }
    })
  } catch (error) {
    console.error("Error in business status GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
