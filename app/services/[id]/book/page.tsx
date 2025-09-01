"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { CheckCircle, Star } from "lucide-react"

const supabase = createClient()

export default function BookServicePage() {
  const params = useParams()
  const serviceId = params.id as string

  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    specialInstructions: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)

  useEffect(() => {
    fetchService()
  }, [serviceId])

  const fetchService = async () => {
    try {
      setLoading(true)

      const { data: serviceData, error } = await supabase
        .from("services")
        .select(`
          *,
          businesses (
            id,
            name,
            logo_url,
            city,
            state,
            rating,
            total_reviews
          )
        `)
        .eq("id", serviceId)
        .eq("is_active", true)
        .single()

      if (error) {
        console.error("Error fetching service:", error)
        setService(null)
        return
      }

      if (!serviceData) {
        setService(null)
        return
      }

      const formattedService = {
        id: serviceData.id,
        business_id: serviceData.businesses?.id,
        name: serviceData.name,
        provider: serviceData.businesses?.name || "Service Provider",
        providerAvatar: serviceData.businesses?.logo_url || "/placeholder.svg?height=60&width=60",
        category: serviceData.category || "General",
        description: serviceData.description,
        longDescription:
          serviceData.description +
          " Our professional team uses high-quality equipment and follows industry best practices to ensure excellent results.",
        price: serviceData.price,
        duration: serviceData.duration,
        rating: serviceData.businesses?.rating || 4.5,
        reviews: serviceData.businesses?.total_reviews || 0,
        location: serviceData.businesses
          ? `${serviceData.businesses.city || "Local Area"}${serviceData.businesses.state ? ", " + serviceData.businesses.state : ""}`
          : "Local Area",
        image: serviceData.image_url || "/placeholder.svg?height=300&width=400",
        features: ["Professional service", "All equipment included", "Insured & bonded", "Satisfaction guaranteed"],
        availability: generateAvailability(),
      }

      setService(formattedService)
    } catch (error) {
      console.error("Error fetching service:", error)
      setService(null)
    } finally {
      setLoading(false)
    }
  }

  const generateAvailability = () => {
    const times = []
    for (let hour = 8; hour <= 18; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`)
      times.push(`${hour.toString().padStart(2, '0')}:30`)
    }
    return times
  }

  const handleBooking = async () => {
    setIsLoading(true)

    try {
      const userInfo = localStorage.getItem("userInfo")
      if (!userInfo) {
        alert("Please log in to book a service.")
        window.location.href = "/auth/login"
        return
      }

      const user = JSON.parse(userInfo)
      
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError) {
        console.error("Error fetching user profile:", profileError)
        alert("Unable to load user profile. Please try again.")
        return
      }

      if (!service.business_id) {
        console.error("Missing business_id for service")
        alert("Service configuration error. Please try again.")
        return
      }

      const { data: bookingData, error } = await supabase
        .from("bookings")
        .insert({
          customer_id: user.id,
          business_id: service.business_id,
          service_id: service.id,
          booking_date: selectedDate?.toISOString().split("T")[0],
          booking_time: selectedTime,
          total_amount: service.price,
          status: "pending",
          payment_status: "pending",
          customer_notes: customerInfo.specialInstructions,
          notes: `Customer: ${customerInfo.firstName} ${customerInfo.lastName}, Email: ${customerInfo.email}, Phone: ${customerInfo.phone}, Address: ${customerInfo.address}`,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating booking:", error)
        throw error
      }

      // Save booking to localStorage for immediate dashboard access
      const bookingForStorage = {
        id: bookingData.id,
        customer_id: user.id,
        business_id: service.business_id,
        service_id: service.id,
        booking_date: selectedDate?.toISOString().split("T")[0],
        booking_time: selectedTime,
        total_amount: service.price,
        status: "pending",
        payment_status: "pending",
        customer_notes: customerInfo.specialInstructions,
        notes: `Customer: ${customerInfo.firstName} ${customerInfo.lastName}, Email: ${customerInfo.email}, Phone: ${customerInfo.phone}, Address: ${customerInfo.address}`,
        created_at: new Date().toISOString(),
        services: {
          name: service.name,
          price: service.price,
          category: service.category
        },
        businesses: {
          name: service.provider,
          email: "",
          phone: ""
        },
        users: {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          email: customerInfo.email,
          phone: customerInfo.phone
        }
      }

      // Get existing bookings from localStorage
      const existingBookings = JSON.parse(localStorage.getItem("userBookings") || "[]")
      const updatedBookings = [...existingBookings, bookingForStorage]
      localStorage.setItem("userBookings", JSON.stringify(updatedBookings))

      if (paymentMethod === "cash") {
        setBookingComplete(true)
      } else {
        const paymentParams = new URLSearchParams({
          bookingId: bookingData.id,
          service: service.name,
          provider: service.provider,
          date: selectedDate?.toISOString().split("T")[0] || "",
          time: selectedTime,
          duration: service.duration.toString(),
          price: service.price.toString(),
          customer: `${customerInfo.firstName} ${customerInfo.lastName}`,
          address: customerInfo.address,
        })

        window.location.href = `/services/${service.id}/book/payment?${paymentParams.toString()}`
      }
    } catch (error) {
      console.error("Booking failed:", error)
      alert("Failed to create booking. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    return (
      selectedDate &&
      selectedTime &&
      customerInfo.firstName &&
      customerInfo.lastName &&
      customerInfo.email &&
      customerInfo.phone &&
      customerInfo.address
    )
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Your booking has been successfully created and saved to your dashboard.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-green-800 mb-2">Booking Details:</h3>
              <p className="text-sm text-green-700 mb-1">
                <strong>Service:</strong> {service?.name}
              </p>
              <p className="text-sm text-green-700 mb-1">
                <strong>Provider:</strong> {service?.provider}
              </p>
              <p className="text-sm text-green-700 mb-1">
                <strong>Date:</strong> {selectedDate?.toLocaleDateString()}
              </p>
              <p className="text-sm text-green-700 mb-1">
                <strong>Time:</strong> {selectedTime}
              </p>
              <p className="text-sm text-green-700">
                <strong>Amount:</strong> R{service?.price}
              </p>
            </div>
            <div className="space-y-4">
              <Link href="/dashboard">
                <Button className="w-full">View My Bookings</Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" className="w-full">Browse More Services</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading service details...</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Service Not Found</h1>
          <p className="text-muted-foreground mb-6">The service you're looking for doesn't exist or is no longer available.</p>
          <Link href="/services">
            <Button>Browse Services</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/services" className="text-muted-foreground hover:text-foreground">
              ← Back to Services
            </Link>
            <h1 className="text-3xl font-bold text-foreground mt-4">Book Service</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Service Details */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6 border">
                <div className="flex items-start space-x-4">
                  <div className="h-16 w-16 bg-accent rounded-lg flex items-center justify-center">
                    <span className="text-accent-foreground font-bold text-lg">
                      {service.provider.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-foreground">{service.name}</h2>
                    <p className="text-muted-foreground">{service.provider}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{service.rating}</span>
                      <span className="text-sm text-muted-foreground">({service.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-foreground">R{service.price}</span>
                    <span className="text-sm text-muted-foreground">{service.duration} minutes</span>
                  </div>
                </div>
              </div>

              {/* Service Features */}
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold text-foreground mb-4">What's Included</h3>
                <ul className="space-y-2">
                  {service.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Booking Form */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Booking Details</h3>
                
                {/* Date Selection */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Date
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate?.toISOString().split('T')[0] || ''}
                      onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : undefined)}
                      className="w-full p-3 border border-border rounded-md bg-background text-foreground"
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Time
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full p-3 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="">Choose a time</option>
                      {service.availability.map((time: string, index: number) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={customerInfo.firstName}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full p-3 border border-border rounded-md bg-background text-foreground"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={customerInfo.lastName}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full p-3 border border-border rounded-md bg-background text-foreground"
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-3 border border-border rounded-md bg-background text-foreground"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full p-3 border border-border rounded-md bg-background text-foreground"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Address
                    </label>
                    <textarea
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full p-3 border border-border rounded-md bg-background text-foreground"
                      rows={3}
                      placeholder="Enter your address"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Special Instructions
                    </label>
                    <textarea
                      value={customerInfo.specialInstructions}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, specialInstructions: e.target.value }))}
                      className="w-full p-3 border border-border rounded-md bg-background text-foreground"
                      rows={3}
                      placeholder="Any special instructions or requirements"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary"
                    />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary"
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Booking Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provider</span>
                    <span className="font-medium">{service.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{service.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium capitalize">{paymentMethod}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-bold text-foreground">R{service.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <Button
                onClick={handleBooking}
                disabled={!isFormValid() || isLoading}
                className="w-full py-3 text-lg"
              >
                {isLoading ? "Processing..." : `Book Now - R${service.price}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
