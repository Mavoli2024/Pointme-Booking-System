"use client"

import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Star, MapPin, Clock, DollarSign, ArrowLeft, CheckCircle, Heart, Share2 } from "lucide-react"
import Link from "next/link"

// Mock service data (same as booking page)
const serviceData = {
  1: {
    id: 1,
    name: "Standard House Cleaning",
    provider: "CleanPro Services",
    providerAvatar: "/placeholder.svg?height=60&width=60",
    category: "Cleaning",
    description:
      "Complete house cleaning including all rooms, bathrooms, and kitchen. Our professional team uses eco-friendly products and brings all necessary equipment.",
    longDescription:
      "Our standard house cleaning service includes dusting all surfaces, vacuuming carpets and rugs, mopping floors, cleaning bathrooms (toilets, sinks, showers, mirrors), kitchen cleaning (counters, appliances, sink), and general tidying. We use only eco-friendly, non-toxic cleaning products that are safe for your family and pets.",
    price: 120,
    duration: 120,
    rating: 4.9,
    reviews: 127,
    location: "Downtown",
    image: "/professional-home-cleaning.png",
    features: ["Eco-friendly products", "All equipment included", "Insured & bonded", "Satisfaction guaranteed"],
    gallery: [
      "/professional-home-cleaning.png",
      "/placeholder.svg?height=300&width=400&text=Before+After",
      "/placeholder.svg?height=300&width=400&text=Team+Photo",
    ],
  },
}

// Mock reviews data
const reviews = [
  {
    id: 1,
    customerName: "Sarah M.",
    rating: 5,
    date: "2024-01-10",
    comment:
      "Excellent service! The team was professional, thorough, and left my house spotless. Will definitely book again.",
    verified: true,
  },
  {
    id: 2,
    customerName: "Mike R.",
    rating: 5,
    date: "2024-01-08",
    comment: "Very impressed with the quality of work. They were punctual and paid attention to every detail.",
    verified: true,
  },
  {
    id: 3,
    customerName: "Jennifer L.",
    rating: 4,
    date: "2024-01-05",
    comment:
      "Great cleaning service. The only minor issue was they arrived 15 minutes late, but the quality made up for it.",
    verified: true,
  },
]

export default function ServiceDetailPage() {
  const params = useParams()
  const serviceId = params.id as string
  const service = serviceData[serviceId as keyof typeof serviceData]

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Service Not Found</h1>
          <p className="text-muted-foreground mb-4">The service you're looking for doesn't exist.</p>
          <Link href="/services">
            <Button>Browse Services</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/services" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Services</span>
            </Link>
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-foreground">PointMe</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Images */}
            <Card>
              <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h1 className="text-2xl font-bold">{service.name}</h1>
                        <Badge variant="outline">{service.category}</Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={service.providerAvatar || "/placeholder.svg"} />
                            <AvatarFallback>{service.provider[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{service.provider}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{service.rating}</span>
                          <span className="text-muted-foreground">({service.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{service.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${service.price}</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2">About This Service</h3>
                    <p className="text-muted-foreground">{service.longDescription}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">What's Included</h3>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Customer Reviews</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{service.rating}</span>
                      </div>
                      <span className="text-muted-foreground">({service.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{review.customerName}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{review.comment}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">${service.price}</div>
                    <div className="text-sm text-muted-foreground">{service.duration} minutes</div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{service.duration} minutes</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{service.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rating:</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>
                          {service.rating} ({service.reviews})
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <Link href={`/services/${service.id}/book`}>
                    <Button className="w-full" size="lg">
                      Book Now
                    </Button>
                  </Link>

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Free cancellation up to 24 hours before service</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Provider Info */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">About the Provider</h3>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={service.providerAvatar || "/placeholder.svg"} />
                      <AvatarFallback>{service.provider[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{service.provider}</div>
                      <div className="text-sm text-muted-foreground">Professional cleaning service</div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{service.rating} rating</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Provider Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
