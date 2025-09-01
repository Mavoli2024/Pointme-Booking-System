import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    console.log("Debug bookings request for email:", email)

    // Get all bookings with related data
    const { data: allBookings, error: allError } = await supabase
      .from("bookings")
      .select(`
        *,
        businesses(name, email, phone),
        services(name, price),
        users(name, email, phone)
      `)
      .order("created_at", { ascending: false })

    if (allError) {
      console.error("Error fetching all bookings:", allError)
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
    }

    console.log("Total bookings in database:", allBookings?.length || 0)

    let userBookings = []
    let userInfo = null

    if (email) {
      // Get user info
      const { data: user } = await supabase
        .from("users")
        .select("id, name, email")
        .eq("email", email)
        .single()

      if (user) {
        userInfo = user
        console.log("User found:", user)

        // Get bookings for this user
        const { data: bookings, error: userError } = await supabase
          .from("bookings")
          .select(`
            *,
            businesses(name, email, phone),
            services(name, price)
          `)
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false })

        if (userError) {
          console.error("Error fetching user bookings:", userError)
        } else {
          userBookings = bookings || []
          console.log("User bookings found:", userBookings.length)
        }
      } else {
        console.log("No user found for email:", email)
      }
    }

    // Categorize bookings by status
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const upcoming = userBookings.filter((booking) => {
      const bookingDate = new Date(booking.booking_date)
      return bookingDate >= today && booking.status !== "cancelled"
    })

    const past = userBookings.filter((booking) => {
      const bookingDate = new Date(booking.booking_date)
      return bookingDate < today && booking.status !== "cancelled"
    })

    const cancelled = userBookings.filter((booking) => booking.status === "cancelled")

    const result = {
      user: userInfo,
      totalBookings: userBookings.length,
      allBookings: allBookings?.length || 0,
      userBookings: userBookings,
      categorized: {
        upcoming: upcoming.length,
        past: past.length,
        cancelled: cancelled.length
      },
      upcoming,
      past,
      cancelled,
      debug: {
        today: today.toISOString(),
        userEmail: email,
        userFound: !!userInfo
      }
    }

    console.log("Debug result:", result)

    return NextResponse.json(result)

  } catch (error) {
    console.error("Error in debug bookings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


