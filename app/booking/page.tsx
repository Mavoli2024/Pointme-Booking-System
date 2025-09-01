"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { 
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
  business_id: string
  business_name: string
}

interface Business {
  id: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  category: string
  rating: number
  total_reviews: number
  verified: boolean
}

export default function BookingPage() {
  const searchParams = useSearchParams()
  const businessId = searchParams.get('business')
  const serviceId = searchParams.get('service')
  
  const [business, setBusiness] = useState<Business | null>(null)
  const [service, setService] = useState<Service | null>(null)
  const [availableServices, setAvailableServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Booking form state
  const [bookingDate, setBookingDate] = useState<Date>()
  const [bookingTime, setBookingTime] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchBookingData()
  }, [businessId, serviceId])

  const fetchBookingData = async () => {
    try {
      const supabase = createClient()
      
      if (serviceId) {
        // Fetch service and business details
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select(`
            *,
            business:businesses!services_business_id_fkey (
              id,
              name,
              description,
              address,
              phone,
              email,
              category,
              rating,
              total_reviews,
              verified
            )
          `)
          .eq('id', serviceId)
          .single()

        if (serviceError) throw serviceError

        setService({
          id: serviceData.id,
          name: serviceData.name,
          description: serviceData.description,
          price: serviceData.price,
          duration: serviceData.duration,
          category: serviceData.category_id,
          business_id: serviceData.business_id,
          business_name: serviceData.business?.name || ""
        })

        setBusiness(serviceData.business)
      } else if (businessId) {
        // Fetch business details and available services
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', businessId)
          .single()

        if (businessError) throw businessError

        setBusiness(businessData)

        // Fetch available services for this business
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .eq('business_id', businessId)
          .eq('is_active', true)

        if (!servicesError && servicesData) {
          setAvailableServices(servicesData.map(service => ({
            id: service.id,
            name: service.name,
            description: service.description,
            price: service.price,
            duration: service.duration,
            category: service.category_id,
            business_id: service.business_id,
            business_name: businessData.name
          })))
        }
      }

    } catch (error) {
      console.error('Error fetching booking data:', error)
      setError("Failed to load booking information")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("") // Clear previous errors

    try {
      // Validate required fields
      if (!business?.id) {
        throw new Error("Business information is missing")
      }
      if (!service?.id) {
        throw new Error("Please select a service to book")
      }
      if (!bookingDate) {
        throw new Error("Please select a booking date")
      }
      if (!bookingTime) {
        throw new Error("Please select a booking time")
      }
      if (!customerName.trim()) {
        throw new Error("Please enter your full name")
      }
      if (!customerEmail.trim()) {
        throw new Error("Please enter your email address")
      }
      if (!customerPhone.trim()) {
        throw new Error("Please enter your phone number")
      }

      const supabase = createClient()
      
      // Get current user ID if available
      const { data: { user } } = await supabase.auth.getUser()
      
      console.log('Creating booking with data:', {
        customer_id: user?.id || null,
        business_id: business.id,
        service_id: service.id,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        booking_date: bookingDate.toISOString().split('T')[0],
        booking_time: bookingTime,
        special_instructions: specialRequests,
        total_amount: service.price,
        status: 'pending',
        payment_status: 'pending',
        payment_method: 'cash'
      })
      
      // Create booking with correct field names
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          customer_id: user?.id || null,
          business_id: business.id,
          service_id: service.id,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          booking_date: bookingDate.toISOString().split('T')[0],
          booking_time: bookingTime,
          special_instructions: specialRequests,
          total_amount: service.price,
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'cash'
        })
        .select()
        .single()

      if (bookingError) {
        console.error('Supabase booking error:', bookingError)
        throw new Error(bookingError.message || 'Failed to create booking')
      }

      console.log('Booking created successfully:', bookingData)

      // Redirect to success page or dashboard
      window.location.href = `/dashboard?booking_success=${bookingData.id}`

    } catch (error) {
      console.error('Error creating booking:', error)
      if (error instanceof Error) {
        setError(`Failed to create booking: ${error.message}`)
      } else {
        setError("Failed to create booking. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading booking information...</p>
        </div>
      </div>
    )
  }

  if (error || (!business && !service)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Booking Not Available</h2>
          <p className="text-muted-foreground mb-4">
            {error || "The service or business you're trying to book is not available."}
          </p>
          <Link href="/business">
            <Button>Browse Businesses</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Book Appointment</h1>
              <p className="text-muted-foreground">Schedule your service appointment</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">My Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>Fill in your appointment information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service/Business Info */}
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-semibold mb-2">Service Information</h3>
                    {service && (
                      <div className="space-y-2">
                        <p className="text-lg font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {service.duration} minutes
                          </span>
                          <span className="flex items-center font-semibold">
                            <DollarSign className="h-4 w-4 mr-1" />
                            R{service.price}
                          </span>
                        </div>
                      </div>
                    )}
                    {!service && availableServices.length > 0 && (
                      <div className="space-y-3">
                        <Label htmlFor="service">Select a Service</Label>
                        <Select onValueChange={(value) => {
                          const selectedService = availableServices.find(s => s.id === value)
                          setService(selectedService || null)
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a service to book" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableServices.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                <div className="flex justify-between items-center w-full">
                                  <span>{service.name}</span>
                                  <span className="text-sm text-muted-foreground">R{service.price}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {service && (
                          <div className="mt-3 p-3 bg-background border rounded">
                            <p className="text-sm text-muted-foreground">{service?.description || 'No description available'}</p>
                            <div className="flex items-center space-x-4 text-sm mt-2">
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {service?.duration || 0} minutes
                              </span>
                              <span className="flex items-center font-semibold">
                                <DollarSign className="h-4 w-4 mr-1" />
                                R{service?.price || 0}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {business && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="font-medium">{business.name}</p>
                        <p className="text-sm text-muted-foreground">{business.address}</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm">{business.rating.toFixed(1)} ({business.total_reviews} reviews)</span>
                          {business.verified && (
                            <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Date and Time */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="date">Preferred Date</Label>
                      <Calendar
                        mode="single"
                        selected={bookingDate}
                        onSelect={setBookingDate}
                        className="rounded-md border mt-2"
                        disabled={(date) => date < new Date()}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="time">Preferred Time</Label>
                      <Select value={bookingTime} onValueChange={setBookingTime}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="12:00">12:00 PM</SelectItem>
                          <SelectItem value="13:00">1:00 PM</SelectItem>
                          <SelectItem value="14:00">2:00 PM</SelectItem>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                          <SelectItem value="16:00">4:00 PM</SelectItem>
                          <SelectItem value="17:00">5:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Your Information</h3>
                    
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <Label htmlFor="requests">Special Requests (Optional)</Label>
                    <Textarea
                      id="requests"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any special requirements or notes..."
                      rows={3}
                    />
                  </div>

                  {error && (
                    <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isSubmitting || !bookingDate || !bookingTime}>
                    {isSubmitting ? "Creating Booking..." : "Confirm Booking"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {service && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">{service.duration} minutes</p>
                    </div>
                    <p className="font-bold">R{service.price}</p>
                  </div>
                )}
                
                {bookingDate && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Date & Time</p>
                      <p className="text-sm text-muted-foreground">
                        {bookingDate.toLocaleDateString()} at {bookingTime}
                      </p>
                    </div>
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">R{service?.price || 0}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Payment will be processed after booking confirmation
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Business Contact */}
            {business && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{business.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{business.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{business.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{business.email}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
