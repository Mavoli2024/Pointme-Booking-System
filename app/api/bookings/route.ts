import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const businessId = searchParams.get("business_id")
    const customerId = searchParams.get("customer_id")
    const customerEmail = searchParams.get("customer_email")

    let query = supabase
      .from("bookings")
      .select(`
        *,
        businesses(name, email, phone),
        services(name, price),
        users(name, email, phone)
      `)

    if (status) {
      query = query.eq("status", status)
    }

    if (businessId) {
      query = query.eq("business_id", businessId)
    }

    if (customerId) {
      query = query.eq("customer_id", customerId)
    }

    if (customerEmail) {
      // First get the user ID from email
      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("email", customerEmail)
        .single()
      
      if (userData) {
        query = query.eq("customer_id", userData.id)
      } else {
        // If no user found, return empty array
        return NextResponse.json({ bookings: [] })
      }
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching bookings:", error)
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
    }

    return NextResponse.json({ bookings: data })
  } catch (error) {
    console.error("Error in bookings GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    // Calculate commission (5% default)
    const commissionAmount = (body.total_amount * 0.05)
    const bookingData = {
      ...body,
      commission_amount: commissionAmount,
      status: "pending",
      payment_status: "pending"
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert([bookingData])
      .select()
      .single()

    if (error) {
      console.error("Error creating booking:", error)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    // Create commission record
    if (data) {
      await supabase
        .from("commissions")
        .insert([{
          booking_id: data.id,
          business_id: data.business_id,
          amount: commissionAmount,
          percentage: 5.00,
          status: "pending"
        }])
    }

    return NextResponse.json({ booking: data }, { status: 201 })
  } catch (error) {
    console.error("Error in bookings POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
