import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createClient()
    const { data, error } = await supabase
      .from("businesses")
      .select(`
        *,
        service_categories(name),
        users(name, email, phone),
        services(*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching business:", error)
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    return NextResponse.json({ business: data })
  } catch (error) {
    console.error("Error in business GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("businesses")
      .update(body)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating business:", error)
      return NextResponse.json({ error: "Failed to update business" }, { status: 500 })
    }

    return NextResponse.json({ business: data })
  } catch (error) {
    console.error("Error in business PATCH:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
