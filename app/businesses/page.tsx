"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Search, MapPin, Star, Users, Clock, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"

const supabase = createClient()

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Cleaning", "Plumbing", "Beauty & Wellness", "Landscaping", "Electrical"]

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const fetchBusinesses = async () => {
    try {
      setLoading(true)

      const { data: businessData, error } = await supabase
        .from("businesses")
        .select(`
          *,
          users (
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq("status", "approved")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching businesses:", error)
        setBusinesses([])
        return
      }

      // Transform data to match UI expectations
      const transformedBusinesses =
        businessData?.map((business: any) => ({
          id: business.id,
          name: business.business_name || business.name,
          description: business.description,
          category: business.category || "General Services",
          location: `${business.city || "Local Area"}${business.province ? ", " + business.province : ""}`,
          rating: business.average_rating || 4.5,
          reviewCount: business.total_reviews || 0,
          servicesCount: business.total_services || 0,
          phone: business.phone || business.users?.phone,
          email: business.email || business.users?.email,
          image: business.logo_url || "/placeholder.svg?height=200&width=300",
          verified: business.status === "approved",
          responseTime: "Within 4 hours",
          owner_name: business.users
            ? `${business.users.first_name || ""} ${business.users.last_name || ""}`.trim()
            : "Business Owner",
        })) || []

      setBusinesses(transformedBusinesses)
    } catch (error) {
      console.error("Error loading businesses:", error)
      setBusinesses([])
    } finally {
      setLoading(false)
    }
  }

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || business.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading businesses...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Browse Local Businesses</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover trusted service providers in your area. All businesses are verified and rated by real customers.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search businesses by name or service..."
                  className="pl-10 text-foreground placeholder:text-muted-foreground border-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="City or Location"
                  className="pl-10 text-foreground placeholder:text-muted-foreground border-input"
                />
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === selectedCategory ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria or browse all categories</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <Card key={business.id} className="hover:shadow-lg transition-shadow border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg text-foreground">{business.name}</CardTitle>
                        {business.verified && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{business.description}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {business.location}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-foreground">{business.rating}</span>
                        <span className="text-muted-foreground">({business.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {business.servicesCount} services
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Responds {business.responseTime}
                    </div>

                    {(business.phone || business.email) && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {business.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span className="text-xs">{business.phone}</span>
                          </div>
                        )}
                        {business.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="text-xs">{business.email}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Link href={`/businesses/${business.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          View Profile
                        </Button>
                      </Link>
                      <Link href={`/businesses/${business.id}/services`} className="flex-1">
                        <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                          View Services
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8 bg-transparent">
            Load More Businesses
          </Button>
        </div>
      </main>
    </div>
  )
}
