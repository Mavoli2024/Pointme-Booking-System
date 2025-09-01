import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")

    let query = supabase
      .from("businesses")
      .select(`
        *,
        service_categories(name),
        users(name, email, phone)
      `)

    if (status) {
      query = query.eq("status", status)
    }

    if (category) {
      query = query.eq("category_id", category)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching businesses:", error)
      return NextResponse.json({ error: "Failed to fetch businesses" }, { status: 500 })
    }

    return NextResponse.json({ businesses: data })
  } catch (error) {
    console.error("Error in businesses GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("businesses")
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error("Error creating business:", error)
      return NextResponse.json({ error: "Failed to create business" }, { status: 500 })
    }

    return NextResponse.json({ business: data }, { status: 201 })
  } catch (error) {
    console.error("Error in businesses POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
