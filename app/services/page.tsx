"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search,
  Filter,
  Clock,
  DollarSign,
  MapPin,
  Star,
  Calendar,
  Heart,
  Eye,
  Building2,
  Users,
  CheckCircle,
  TrendingUp
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
  category_name: string
  business_id: string
  business_name: string
  business_address: string
  business_rating: number
  business_verified: boolean
  is_active: boolean
  image?: string
}

export default function ServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    filterServices()
  }, [services, searchQuery, selectedCategory, priceRange, sortBy])

  const fetchServices = async () => {
    try {
      const supabase = createClient()
      
      const { data: servicesData, error } = await supabase
        .from('services')
        .select(`
          *,
          category:service_categories!services_category_id_fkey (name),
          business:businesses!services_business_id_fkey (
            name,
            address,
            rating,
            verified
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedServices: Service[] = servicesData?.map((service: any) => ({
        id: service.id,
        name: service.name,
        description: service.description || "",
        price: service.price || 0,
        duration: service.duration || 30,
        category: service.category_id,
        category_name: service.category?.name || "Other",
        business_id: service.business_id,
        business_name: service.business?.name || "Unknown Business",
        business_address: service.business?.address || "",
        business_rating: service.business?.rating || 0,
        business_verified: service.business?.verified || false,
        is_active: service.is_active,
        image: service.image
      })) || []

      setServices(formattedServices)

      // Extract unique categories
      const uniqueCategories = [...new Set(formattedServices.map(s => s.category_name))]
      setCategories(uniqueCategories)

    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterServices = () => {
    let filtered = [...services]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.business_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(service => service.category_name === selectedCategory)
    }

    // Price range filter
    if (priceRange !== "all") {
      filtered = filtered.filter(service => {
        const price = service.price
        switch (priceRange) {
          case "0-50":
            return price <= 50
          case "51-100":
            return price > 50 && price <= 100
          case "101-200":
            return price > 100 && price <= 200
          case "200+":
            return price > 200
          default:
            return true
        }
      })
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "duration":
          return a.duration - b.duration
        case "rating":
          return b.business_rating - a.business_rating
        case "name":
          return a.name.localeCompare(b.name)
        case "popular":
        default:
          return b.business_rating - a.business_rating
      }
    })

    setFilteredServices(filtered)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading services...</p>
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
              <h1 className="text-3xl font-bold text-foreground">Browse Services</h1>
              <p className="text-muted-foreground">Find and book the perfect service for your needs</p>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/dashboard">
                <Button variant="outline">My Bookings</Button>
              </Link>
              <Link href="/business">
                <Button>Find Businesses</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services, businesses, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Filter */}
        <div className="mb-6">
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Prices" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-50">R0 - R50</SelectItem>
              <SelectItem value="51-100">R51 - R100</SelectItem>
              <SelectItem value="101-200">R101 - R200</SelectItem>
              <SelectItem value="200+">R200+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No services found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse all categories
            </p>
            <Button onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
              setPriceRange("all")
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  {service.image ? (
                    <img 
                      src={service.image} 
                      alt={service.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-primary/40" />
                    </div>
                  )}
                  
                  <Badge className="absolute top-2 left-2 bg-primary">
                    {service.category_name}
                  </Badge>
                  
                  {service.business_verified && (
                    <Badge className="absolute top-2 right-2 bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Building2 className="h-4 w-4 mr-1" />
                        {service.business_name}
                        {service.business_rating > 0 && (
                          <div className="flex items-center ml-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium">{service.business_rating.toFixed(1)}</span>
                          </div>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {service.description || "Professional service"}
                  </p>

                  {service.business_address && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {service.business_address}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDuration(service.duration)}
                    </div>
                    <div className="flex items-center font-bold text-primary">
                      <DollarSign className="h-4 w-4" />
                      R{service.price}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Link href={`/business/${service.business_id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    
                    <Link href={`/booking?service=${service.id}`}>
                      <Button size="sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Featured Categories */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((category) => {
              const categoryCount = services.filter(s => s.category_name === category).length
              return (
                <Card 
                  key={category} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedCategory(category)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">{category}</h3>
                    <p className="text-sm text-muted-foreground">{categoryCount} services</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Can't find what you're looking for?</CardTitle>
              <CardDescription>
                Contact us and we'll help you find the perfect service provider
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/contact">
                  <Button variant="outline">
                    Contact Support
                  </Button>
                </Link>
                <Link href="/business">
                  <Button>
                    Browse All Businesses
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}