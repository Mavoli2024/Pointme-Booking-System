import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Try to fetch services, but don't fail if table doesn't exist
    let services = []
    let categories = []
    
    try {
      const { data: serviceData, error } = await supabase
        .from("services")
        .select(`
          *,
          businesses (
            name,
            logo_url,
            city,
            state,
            rating,
            total_reviews
          )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching services:", error)
        // Don't return error, just use empty array
      } else {
        services = serviceData || []
      }
    } catch (serviceError) {
      console.error("Service fetch error:", serviceError)
    }

    // Try to fetch categories, but don't fail if table doesn't exist
    try {
      const { data: categoryData, error: categoriesError } = await supabase
        .from("service_categories")
        .select("name")
        .order("name")

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError)
      } else {
        categories = categoryData?.map(cat => cat.name) || []
      }
    } catch (categoryError) {
      console.error("Category fetch error:", categoryError)
    }

    return NextResponse.json({
      services: services,
      categories: categories,
      total: services.length
    })
  } catch (error) {
    console.error("Error in services API:", error)
    return NextResponse.json({
      services: [],
      categories: [],
      total: 0
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    // Validate required fields
    if (!body.business_id || !body.name || !body.price) {
      return NextResponse.json({ 
        error: "Missing required fields: business_id, name, and price are required" 
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("services")
      .insert({
        business_id: body.business_id,
        name: body.name,
        description: body.description || "",
        price: parseFloat(body.price),
        duration: body.duration ? parseInt(body.duration) : null,
        is_active: body.is_active !== false
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating service:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ service: data }, { status: 201 })
  } catch (error) {
    console.error("Error in services POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
