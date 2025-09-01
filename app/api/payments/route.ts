import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import crypto from "crypto"

const validatePayFastConfig = () => {
  const merchantId = process.env.PAYFAST_MERCHANT_ID
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!merchantId || !merchantKey || !appUrl) {
    console.warn("⚠️ PayFast configuration incomplete. Using test credentials.")
    return false
  }
  return true
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get("booking_id")
    const userId = searchParams.get("user_id")

    if (!supabase) {
      console.error("Supabase client not available")
      return NextResponse.json(
        {
          error: "Database service unavailable",
          payments: [],
        },
        { status: 503 },
      )
    }

    let query = supabase
      .from("payments")
      .select(`
        *,
        bookings (
          *,
          services (title),
          businesses (business_name)
        )
      `)
      .order("created_at", { ascending: false })

    if (bookingId) {
      query = query.eq("booking_id", bookingId)
    }

    const { data: payments, error } = await query

    if (error) {
      console.error("Database error fetching payments:", error.message)
      return NextResponse.json(
        {
          error: "Failed to fetch payments",
          details: process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ payments: payments || [] })
  } catch (error) {
    console.error("Unexpected error in payments GET:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { booking_id, amount, payment_method, payment_data } = body

    if (!booking_id || !amount || amount <= 0) {
      return NextResponse.json(
        {
          error: "Invalid payment data",
          details: "booking_id and positive amount are required",
        },
        { status: 400 },
      )
    }

    // Calculate 5% commission
    const commission_amount = amount * 0.05

    let paymentStatus = "pending"
    let transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    if (payment_method === "payfast") {
      const isPayFastConfigured = validatePayFastConfig()

      const payfastData = {
        merchant_id: process.env.PAYFAST_MERCHANT_ID || "10000100",
        merchant_key: process.env.PAYFAST_MERCHANT_KEY || "46f0cd694581a",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/cancel`,
        notify_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payments/payfast/notify`,
        name_first: payment_data?.firstName || "Customer",
        name_last: payment_data?.lastName || "User",
        email_address: payment_data?.email || "customer@example.com",
        m_payment_id: booking_id,
        amount: amount.toFixed(2),
        item_name: `Service Booking #${booking_id}`,
        item_description: "PointMe Service Booking Payment",
      }

      // Generate PayFast signature
      const signature = generatePayFastSignature(payfastData)
      paymentStatus = "pending"
      transactionId = `pf_${booking_id}_${Date.now()}`

      if (!supabase) {
        // Store in localStorage as fallback
        const paymentData = {
          id: transactionId,
          booking_id,
          amount,
          commission_amount,
          status: paymentStatus,
          payment_method,
          transaction_id: transactionId,
          payment_data: { ...payfastData, signature },
          created_at: new Date().toISOString(),
        }

        return NextResponse.json({
          payment: paymentData,
          payfast_url: isPayFastConfigured
            ? "https://www.payfast.co.za/eng/process"
            : "https://sandbox.payfast.co.za/eng/process",
          payfast_data: { ...payfastData, signature },
          warning: "Database unavailable - payment stored locally",
        })
      }

      const { data: payment, error } = await supabase
        .from("payments")
        .insert({
          booking_id,
          amount,
          commission_amount,
          status: paymentStatus,
          payment_method,
          transaction_id: transactionId,
          payment_data: { ...payfastData, signature },
        })
        .select()
        .single()

      if (error) {
        console.error("Database error creating PayFast payment:", error.message)
        return NextResponse.json(
          {
            error: "Failed to process payment",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        payment,
        payfast_url: isPayFastConfigured
          ? "https://www.payfast.co.za/eng/process"
          : "https://sandbox.payfast.co.za/eng/process",
        payfast_data: { ...payfastData, signature },
      })
    } else if (payment_method === "cash") {
      paymentStatus = "pending_cash"
      transactionId = `cash_${booking_id}_${Date.now()}`

      const paymentRecord = {
        booking_id,
        amount,
        commission_amount,
        status: paymentStatus,
        payment_method,
        transaction_id: transactionId,
        payment_data: { cash_payment: true, payment_timing: payment_data?.timing || "after_service" },
      }

      if (!supabase) {
        const paymentData = {
          id: transactionId,
          ...paymentRecord,
          created_at: new Date().toISOString(),
        }

        return NextResponse.json({
          payment: paymentData,
          warning: "Database unavailable - payment stored locally",
        })
      }

      const { data: payment, error } = await supabase.from("payments").insert(paymentRecord).select().single()

      if (error) {
        console.error("Database error creating cash payment:", error.message)
        return NextResponse.json(
          {
            error: "Failed to process payment",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
          },
          { status: 500 },
        )
      }

      // Update booking status to confirmed for cash payments
      const { error: bookingError } = await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", booking_id)

      if (bookingError) {
        console.warn("Failed to update booking status:", bookingError.message)
      }

      return NextResponse.json({ payment })
    } else {
      // Default card payment
      paymentStatus = "completed"

      const paymentRecord = {
        booking_id,
        amount,
        commission_amount,
        status: paymentStatus,
        payment_method: payment_method || "card",
        transaction_id: transactionId,
      }

      if (!supabase) {
        const paymentData = {
          id: transactionId,
          ...paymentRecord,
          created_at: new Date().toISOString(),
        }

        return NextResponse.json({
          payment: paymentData,
          warning: "Database unavailable - payment stored locally",
        })
      }

      const { data: payment, error } = await supabase.from("payments").insert(paymentRecord).select().single()

      if (error) {
        console.error("Database error creating payment:", error.message)
        return NextResponse.json(
          {
            error: "Failed to process payment",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
          },
          { status: 500 },
        )
      }

      // Update booking status to confirmed
      const { error: bookingError } = await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", booking_id)

      if (bookingError) {
        console.warn("Failed to update booking status:", bookingError.message)
      }

      return NextResponse.json({ payment })
    }
  } catch (error) {
    console.error("Unexpected error in payments POST:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    )
  }
}

function generatePayFastSignature(data: Record<string, string>) {
  try {
    // Remove signature and hash from data
    const { signature, hash, ...signatureData } = data

    // Create parameter string
    const paramString = Object.keys(signatureData)
      .sort()
      .map((key) => `${key}=${encodeURIComponent(signatureData[key])}`)
      .join("&")

    // Add passphrase if in production
    const passphrase = process.env.PAYFAST_PASSPHRASE || ""
    const stringToHash = passphrase ? `${paramString}&passphrase=${passphrase}` : paramString

    return crypto.createHash("md5").update(stringToHash).digest("hex")
  } catch (error) {
    console.error("Error generating PayFast signature:", error)
    return ""
  }
}
