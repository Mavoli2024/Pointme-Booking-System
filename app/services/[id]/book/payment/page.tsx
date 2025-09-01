"use client"

import { useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Lock, CheckCircle, AlertCircle, Banknote, Smartphone } from "lucide-react"
import Link from "next/link"

// Mock booking data from URL params
const getBookingData = (searchParams: URLSearchParams) => {
  return {
    serviceName: searchParams.get("service") || "Standard House Cleaning",
    providerName: searchParams.get("provider") || "CleanPro Services",
    date: searchParams.get("date") || "2024-01-20",
    time: searchParams.get("time") || "10:00 AM",
    duration: searchParams.get("duration") || "120",
    subtotal: Number.parseFloat(searchParams.get("price") || "120"),
    customerName: searchParams.get("customer") || "John Doe",
    address: searchParams.get("address") || "123 Main St, Downtown",
  }
}

export default function PaymentPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const serviceId = params.id as string
  const booking = getBookingData(searchParams)

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("payfast")
  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })
  const [customerDetails, setCustomerDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paymentError, setPaymentError] = useState("")

  // Calculate fees
  const subtotal = booking.subtotal
  const platformFee = Math.round(subtotal * 0.05 * 100) / 100 // 5% commission
  const processingFee = selectedPaymentMethod === "cash" ? 0 : Math.round(subtotal * 0.029 * 100) / 100
  const total = subtotal + platformFee + processingFee

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentError("")

    try {
      if (selectedPaymentMethod === "payfast") {
        // PayFast payment processing
        const response = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            booking_id: `booking_${Date.now()}`,
            amount: total,
            payment_method: "payfast",
            payment_data: {
              firstName: customerDetails.firstName,
              lastName: customerDetails.lastName,
              email: customerDetails.email,
            },
          }),
        })

        const data = await response.json()

        if (data.payfast_url && data.payfast_data) {
          // Redirect to PayFast
          const form = document.createElement("form")
          form.method = "POST"
          form.action = data.payfast_url

          Object.entries(data.payfast_data).forEach(([key, value]) => {
            const input = document.createElement("input")
            input.type = "hidden"
            input.name = key
            input.value = value as string
            form.appendChild(input)
          })

          document.body.appendChild(form)
          form.submit()
          return
        }
      } else if (selectedPaymentMethod === "cash") {
        // Cash payment processing
        const response = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            booking_id: `booking_${Date.now()}`,
            amount: total,
            payment_method: "cash",
            payment_data: {
              timing: "after_service",
            },
          }),
        })

        const data = await response.json()

        if (data.payment) {
          setPaymentComplete(true)
        }
      } else {
        // Simulate card payment processing
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (paymentMethod.cardNumber === "4000000000000002") {
              reject(new Error("Card declined"))
            } else {
              resolve(true)
            }
          }, 3000)
        })

        setPaymentComplete(true)
      }
    } catch (error) {
      setPaymentError("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const isFormValid = () => {
    if (selectedPaymentMethod === "payfast") {
      return customerDetails.firstName && customerDetails.lastName && customerDetails.email
    } else if (selectedPaymentMethod === "cash") {
      return true
    } else {
      return (
        paymentMethod.cardNumber.length >= 16 &&
        paymentMethod.expiryDate.length >= 5 &&
        paymentMethod.cvv.length >= 3 &&
        paymentMethod.cardholderName.length >= 2
      )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-foreground">PointMe</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-accent rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-sm font-medium">Booking Details</span>
            </div>
            <div className="h-px bg-border flex-1" />
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">2</span>
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
            <div className="h-px bg-muted flex-1" />
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-muted-foreground font-bold text-sm">3</span>
              </div>
              <span className="text-sm text-muted-foreground">Confirmation</span>
            </div>
          </div>

          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{booking.serviceName}</span>
                  <span>R{subtotal}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>{booking.providerName}</div>
                  <div>
                    {new Date(booking.date).toLocaleDateString()} at {booking.time}
                  </div>
                  <div>{booking.duration} minutes</div>
                  <div>{booking.address}</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Service fee</span>
                  <span>R{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Platform fee (5%)</span>
                  <span>R{platformFee}</span>
                </div>
                {processingFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Processing fee (2.9%)</span>
                    <span>R{processingFee}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>R{total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Choose Payment Method</CardTitle>
              <CardDescription>Select how you'd like to pay for this service</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="payfast" id="payfast" />
                  <Label htmlFor="payfast" className="flex items-center space-x-3 cursor-pointer flex-1">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">PayFast (Recommended)</div>
                      <div className="text-sm text-muted-foreground">Secure online payment with card or EFT</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center space-x-3 cursor-pointer flex-1">
                    <Banknote className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Cash Payment</div>
                      <div className="text-sm text-muted-foreground">Pay cash after service completion</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center space-x-3 cursor-pointer flex-1">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium">Credit/Debit Card</div>
                      <div className="text-sm text-muted-foreground">Direct card payment (Demo)</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {selectedPaymentMethod === "payfast" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span>PayFast Payment Details</span>
                </CardTitle>
                <CardDescription>Enter your details for secure PayFast payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={customerDetails.firstName}
                      onChange={(e) => setCustomerDetails((prev) => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={customerDetails.lastName}
                      onChange={(e) => setCustomerDetails((prev) => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <Alert>
                  <AlertDescription>
                    You'll be redirected to PayFast to complete your payment securely.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {selectedPaymentMethod === "cash" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Banknote className="h-5 w-5" />
                  <span>Cash Payment</span>
                </CardTitle>
                <CardDescription>Pay with cash after service completion</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertDescription>
                    <div className="space-y-2">
                      <p>
                        <strong>Payment Instructions:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Your booking will be confirmed immediately</li>
                        <li>Pay the service provider in cash after service completion</li>
                        <li>
                          Total amount: <strong>R{total}</strong> (includes R{platformFee} platform fee)
                        </li>
                        <li>Please have exact change ready</li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {selectedPaymentMethod === "card" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Card Payment (Demo)</span>
                </CardTitle>
                <CardDescription>Your payment information is secure and encrypted</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{paymentError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentMethod.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 16)
                        setPaymentMethod((prev) => ({ ...prev, cardNumber: value }))
                      }}
                      maxLength={16}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={paymentMethod.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "")
                          if (value.length >= 2) {
                            value = `${value.slice(0, 2)}/${value.slice(2, 4)}`
                          }
                          setPaymentMethod((prev) => ({ ...prev, expiryDate: value }))
                        }}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentMethod.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 4)
                          setPaymentMethod((prev) => ({ ...prev, cvv: value }))
                        }}
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      placeholder="John Doe"
                      value={paymentMethod.cardholderName}
                      onChange={(e) => setPaymentMethod((prev) => ({ ...prev, cardholderName: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Test card numbers:</p>
                  <p className="text-xs">Success: 4242424242424242</p>
                  <p className="text-xs">Decline: 4000000000000002</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Action */}
          <Card>
            <CardContent className="pt-6">
              <div className="bg-muted p-4 rounded-lg mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Your payment information is encrypted and secure.</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full" size="lg" onClick={handlePayment} disabled={!isFormValid() || isProcessing}>
                  {isProcessing
                    ? "Processing..."
                    : selectedPaymentMethod === "payfast"
                      ? `Pay R${total} with PayFast`
                      : selectedPaymentMethod === "cash"
                        ? "Confirm Booking (Pay Cash Later)"
                        : `Pay R${total}`}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    By completing this payment, you agree to our{" "}
                    <Link href="/terms" className="text-accent hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-accent hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Success Dialog */}
      <Dialog open={paymentComplete} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center">Payment Successful!</DialogTitle>
            <DialogDescription className="text-center">
              Your booking has been confirmed and payment processed successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Transaction ID:</span>
                <span>TXN_{Date.now()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount Paid:</span>
                <span>R{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Platform Fee:</span>
                <span>R{platformFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Provider Receives:</span>
                <span>R{subtotal}</span>
              </div>
            </div>
            <Alert>
              <AlertDescription>
                You'll receive a confirmation email shortly with your booking details and receipt.
              </AlertDescription>
            </Alert>
          </div>
          <div className="flex flex-col space-y-2">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full">View My Bookings</Button>
            </Link>
            <Link href="/services" className="w-full">
              <Button variant="outline" className="w-full bg-transparent">
                Book Another Service
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
