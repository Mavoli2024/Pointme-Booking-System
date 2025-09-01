"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star,
  Plus,
  Search,
  Filter,
  Eye,
  Heart,
  MessageSquare,
  Calendar,
  CreditCard,
  Shield,
  CheckCircle,
  Users,
  TrendingUp,
  DollarSign
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
  image?: string
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
}

export default function BusinessPage() {
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("rating")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchBusinesses()
  }, [])

  useEffect(() => {
    filterBusinesses()
  }, [businesses, searchQuery, selectedCategory, sortBy])

  const fetchBusinesses = async () => {
    try {
      const supabase = createClient()
      
      const { data: businessData, error } = await supabase
        .from('businesses')
        .select(`
          *,
          services (*),
          business_hours (*),
          category:service_categories!businesses_category_id_fkey (name)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedBusinesses: Business[] = businessData?.map((business: any) => ({
        id: business.id,
        name: business.name,
        description: business.description || "",
        address: business.address || "",
        phone: business.phone || "",
        email: business.email || "",
        category: business.category?.name || "Other",
        rating: business.rating || 0,
        total_reviews: business.total_reviews || 0,
        verified: business.verified || false,
        featured: business.featured || false,
        services: business.services || [],
        business_hours: business.business_hours || [],
        images: business.images || []
      })) || []

      setBusinesses(formattedBusinesses)

      // Extract unique categories
      const uniqueCategories = [...new Set(formattedBusinesses.map(b => b.category))]
      setCategories(uniqueCategories)

    } catch (error) {
      console.error('Error fetching businesses:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterBusinesses = () => {
    let filtered = [...businesses]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.services.some(service => 
          service.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(business => business.category === selectedCategory)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "reviews":
          return b.total_reviews - a.total_reviews
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
          return b.id.localeCompare(a.id)
        default:
          return 0
      }
    })

    setFilteredBusinesses(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading businesses...</p>
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
              <h1 className="text-3xl font-bold text-foreground">Discover Local Businesses</h1>
              <p className="text-muted-foreground">Find and book services from trusted providers in your area</p>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/auth/register?type=business">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  List Your Business
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button>My Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search businesses, services, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
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
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'business' : 'businesses'} found
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Business Grid */}
        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse all categories
            </p>
            <Button onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <Card key={business.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  {business.images.length > 0 ? (
                    <img 
                      src={business.images[0]} 
                      alt={business.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-primary/40" />
                    </div>
                  )}
                  
                  {business.featured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500">
                      Featured
                    </Badge>
                  )}
                  
                  {business.verified && (
                    <Badge className="absolute top-2 right-2 bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{business.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Badge variant="outline" className="mr-2">
                          {business.category}
                        </Badge>
                        {business.rating > 0 && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium">{business.rating.toFixed(1)}</span>
                            <span className="ml-1 text-sm text-muted-foreground">
                              ({business.total_reviews})
                            </span>
                          </div>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {business.description || "Professional services provider"}
                  </p>

                  {business.address && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {business.address}
                    </div>
                  )}

                  {business.services.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {business.services.slice(0, 3).map((service) => (
                          <Badge key={service.id} variant="secondary" className="text-xs">
                            {service.name}
                          </Badge>
                        ))}
                        {business.services.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{business.services.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link href={`/business/${business.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/booking?business=${business.id}`}>
                        <Button size="sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          Book
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Are you a business owner?</CardTitle>
              <CardDescription>
                Join our platform to connect with customers and grow your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Reach more customers</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Grow your business</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Increase revenue</span>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/auth/register?type=business">
                  <Button size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Join as Business Partner
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

