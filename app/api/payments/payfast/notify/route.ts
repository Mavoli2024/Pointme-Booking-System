import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const params = new URLSearchParams(body)

    const paymentId = params.get("m_payment_id")
    const paymentStatus = params.get("payment_status")
    const amountGross = params.get("amount_gross")

    if (paymentStatus === "COMPLETE") {
      // Update payment status
      const { error: paymentError } = await supabase
        .from("payments")
        .update({
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("booking_id", paymentId)

      if (paymentError) {
        console.error("Error updating payment:", paymentError)
        return NextResponse.json({ error: "Failed to update payment" }, { status: 500 })
      }

      // Update booking status
      const { error: bookingError } = await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", paymentId)

      if (bookingError) {
        console.error("Error updating booking:", bookingError)
        return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
      }
    }

    return NextResponse.json({ status: "OK" })
  } catch (error) {
    console.error("Error in PayFast IPN:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
