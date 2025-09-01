"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star,
  Calendar,
  MessageSquare,
  Heart,
  Share,
  Users,
  CheckCircle,
  Clock as ClockIcon,
  DollarSign,
  Eye
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
  is_active: boolean
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
  featured: boolean
  services: Service[]
  business_hours: any
  images: string[]
  total_bookings: number
  total_revenue: number
}

interface Review {
  id: string
  rating: number
  comment: string
  customer_name: string
  service_name: string
  created_at: string
  is_verified: boolean
}

export default function BusinessDetailPage() {
  const params = useParams()
  const businessId = params.id as string
  const [business, setBusiness] = useState<Business | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchBusinessDetails()
  }, [businessId])

  const fetchBusinessDetails = async () => {
    try {
      const supabase = createClient()
      
      // Fetch business details
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select(`
          *,
          services (*),
          business_hours (*),
          category:service_categories!businesses_category_id_fkey (name)
        `)
        .eq('id', businessId)
        .single()

      if (businessError) throw businessError

      const formattedBusiness: Business = {
        id: businessData.id,
        name: businessData.name,
        description: businessData.description || "",
        address: businessData.address || "",
        phone: businessData.phone || "",
        email: businessData.email || "",
        category: businessData.category?.name || "Other",
        rating: businessData.rating || 0,
        total_reviews: businessData.total_reviews || 0,
        verified: businessData.verified || false,
        featured: businessData.featured || false,
        services: businessData.services || [],
        business_hours: businessData.business_hours || [],
        images: businessData.images || [],
        total_bookings: businessData.total_bookings || 0,
        total_revenue: businessData.total_revenue || 0
      }

      setBusiness(formattedBusiness)

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          is_verified,
          customer:users(name),
          booking:bookings(
            service:services(name)
          )
        `)
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })

      if (reviewsError) throw reviewsError

      const formattedReviews: Review[] = reviewsData?.map((review: any) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        customer_name: review.customer?.name || "Anonymous",
        service_name: review.booking?.service?.name || "Unknown Service",
        created_at: review.created_at,
        is_verified: review.is_verified
      })) || []

      setReviews(formattedReviews)

    } catch (error) {
      console.error('Error fetching business details:', error)
      setError("Failed to load business details")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading business details...</p>
        </div>
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Business Not Found</h2>
          <p className="text-muted-foreground mb-4">
            {error || "The business you're looking for doesn't exist or has been removed."}
          </p>
          <Link href="/business">
            <Button>Browse All Businesses</Button>
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{business.name}</h1>
              <p className="text-muted-foreground">{business.category} • {business.address}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/business">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Browse All
                </Button>
              </Link>
              <Link href={`/booking?business=${business.id}`}>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Images */}
            <Card>
              <div className="relative">
                {business.images.length > 0 ? (
                  <img 
                    src={business.images[0]} 
                    alt={business.name}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg flex items-center justify-center">
                    <Building2 className="h-16 w-16 text-primary/40" />
                  </div>
                )}
                
                {business.featured && (
                  <Badge className="absolute top-4 left-4 bg-yellow-500">
                    Featured
                  </Badge>
                )}
                
                {business.verified && (
                  <Badge className="absolute top-4 right-4 bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </Card>

            {/* Business Description */}
            <Card>
              <CardHeader>
                <CardTitle>About {business.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {business.description || "Professional service provider offering quality services to our valued customers."}
                </p>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
                <CardDescription>Browse and book our professional services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {business.services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {service.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{service.name}</h3>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">R{service.price}</div>
                        <div className="text-sm text-muted-foreground">{service.duration}min</div>
                        <Link href={`/booking?service=${service.id}`}>
                          <Button size="sm" className="mt-2">
                            <Calendar className="h-4 w-4 mr-1" />
                            Book
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {business.services.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No services available at the moment
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>
                  {reviews.length} reviews • {business.rating.toFixed(1)} average rating
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{review.customer_name}</span>
                        {review.is_verified && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                      <p className="text-xs text-muted-foreground">
                        {review.service_name} • {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {reviews.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No reviews yet. Be the first to review this business!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Business Info */}
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{business.total_bookings} bookings completed</span>
                </div>
              </CardContent>
            </Card>

            {/* Rating */}
            <Card>
              <CardHeader>
                <CardTitle>Rating & Reviews</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold mb-2">{business.rating.toFixed(1)}</div>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(business.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {business.total_reviews} reviews
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/booking?business=${business.id}`}>
                  <Button className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </Link>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Business
                </Button>
                <Button variant="outline" className="w-full">
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Favorites
                </Button>
                <Button variant="outline" className="w-full">
                  <Share className="h-4 w-4 mr-2" />
                  Share Business
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

