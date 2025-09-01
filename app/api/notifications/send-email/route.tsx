import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, template, data } = body

    if (!to || !subject || !template) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real application, you would integrate with an email service like:
    // - Resend
    // - SendGrid
    // - AWS SES
    // - Mailgun

    console.log("Sending email notification:", {
      to,
      subject,
      template,
      data,
    })

    // Mock email templates
    const emailTemplates = {
      booking_confirmation: {
        subject: "Booking Confirmation - PointMe!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #B91C1C; color: white; padding: 20px; text-align: center;">
              <h1>PointMe!</h1>
              <h2>Booking Confirmed</h2>
            </div>
            <div style="padding: 20px;">
              <p>Dear ${data?.customerName || "Customer"},</p>
              <p>Your booking has been confirmed!</p>
              <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <h3>Booking Details:</h3>
                <p><strong>Service:</strong> ${data?.serviceName || "N/A"}</p>
                <p><strong>Provider:</strong> ${data?.providerName || "N/A"}</p>
                <p><strong>Date:</strong> ${data?.bookingDate || "N/A"}</p>
                <p><strong>Time:</strong> ${data?.bookingTime || "N/A"}</p>
                <p><strong>Total:</strong> R${data?.totalAmount || "0"}</p>
              </div>
              <p>If you need to make any changes, please contact us or the service provider directly.</p>
              <p>Thank you for choosing PointMe!</p>
            </div>
          </div>
        `,
      },
      payment_confirmation: {
        subject: "Payment Confirmation - PointMe!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #B91C1C; color: white; padding: 20px; text-align: center;">
              <h1>PointMe!</h1>
              <h2>Payment Confirmed</h2>
            </div>
            <div style="padding: 20px;">
              <p>Dear ${data?.customerName || "Customer"},</p>
              <p>Your payment has been successfully processed.</p>
              <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <h3>Payment Details:</h3>
                <p><strong>Amount:</strong> R${data?.amount || "0"}</p>
                <p><strong>Service:</strong> ${data?.serviceName || "N/A"}</p>
                <p><strong>Transaction ID:</strong> ${data?.transactionId || "N/A"}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              <p>A receipt has been sent to your email address.</p>
              <p>Thank you for using PointMe!</p>
            </div>
          </div>
        `,
      },
      business_approved: {
        subject: "Business Application Approved - PointMe!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #B91C1C; color: white; padding: 20px; text-align: center;">
              <h1>PointMe!</h1>
              <h2>Welcome to PointMe!</h2>
            </div>
            <div style="padding: 20px;">
              <p>Dear ${data?.businessName || "Business Owner"},</p>
              <p>Congratulations! Your business application has been approved.</p>
              <p>You can now start:</p>
              <ul>
                <li>Creating and managing your services</li>
                <li>Receiving bookings from customers</li>
                <li>Managing your business profile</li>
                <li>Tracking your earnings</li>
              </ul>
              <p>Get started by logging into your business dashboard.</p>
              <p>Welcome to the PointMe! community!</p>
            </div>
          </div>
        `,
      },
    }

    // Simulate email sending
    const selectedTemplate = emailTemplates[template as keyof typeof emailTemplates]
    if (!selectedTemplate) {
      return NextResponse.json({ error: "Invalid template" }, { status: 400 })
    }

    // Mock successful email send
    return NextResponse.json({
      success: true,
      message: "Email notification sent successfully",
      emailId: `email_${Date.now()}`,
    })
  } catch (error) {
    console.error("Error sending email notification:", error)
    return NextResponse.json({ error: "Failed to send email notification" }, { status: 500 })
  }
}
