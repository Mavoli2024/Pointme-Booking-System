"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  Star,
  MessageSquare,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  BarChart3,
  PieChart,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Bell,
  Mail,
  Phone,
  Heart,
  Share2,
  Camera,
  Video,
  CreditCard,
  Wallet,
  Gift,
  TrendingUp,
  Navigation,
  CloudRain,
  Sun,
  Moon,
  Clock3,
  CalendarDays,
  Repeat,
  ArrowRight,
  Search,
  Filter as FilterIcon,
  MapPin as MapPinIcon,
  Star as StarIcon,
  Clock as ClockIcon,
  DollarSign as DollarSignIcon
} from "lucide-react"
import { createClient } from "@/lib/supabase"

interface Booking {
  id: string
  booking_date: string
  booking_time: string
  status: string
  services?: {
    id: string
    name: string
    price: number
    duration: number
  }
  businesses?: {
    id: string
    name: string
    address: string
    phone: string
  }
}

interface Service {
  id: string
  name: string
  price: number
  duration: number
  description: string
  category_id: string
}

interface Provider {
  id: string
  name: string
  rating: number
  review_count: number
  services: string[]
  location: string
  price_range: string
  availability: string
}

export default function CustomerDashboard() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPrice, setFilterPrice] = useState("all")
  const [filterRating, setFilterRating] = useState("all")
  
  // Data states
  const [bookings, setBookings] = useState<Booking[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<Provider[]>([])
  const [favorites, setFavorites] = useState<Provider[]>([])
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+27 123 456 789",
    preferences: ["Home Services", "Beauty", "Wellness"],
    addresses: ["123 Main St, Cape Town", "456 Office Blvd, Johannesburg"],
    paymentMethods: ["Visa ****1234", "Mastercard ****5678"]
  })
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking')

  useEffect(() => {
    fetchCustomerData()
  }, [])

  const fetchCustomerData = async () => {
    try {
      const supabase = createClient()
      
      console.log('🔍 Fetching customer data...')
      console.log('📊 Supabase client created:', !!supabase)
      
      // Fetch user's bookings
      console.log('📅 Fetching bookings...')
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: false })

      if (bookingsError) {
        console.error('❌ Bookings error:', bookingsError)
        throw new Error(`Bookings fetch failed: ${bookingsError.message}`)
      }
      
      console.log('✅ Bookings fetched:', bookingsData?.length || 0)

      // Fetch available services
      console.log('🔧 Fetching services...')
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false })

      if (servicesError) {
        console.error('❌ Services error:', servicesError)
        throw new Error(`Services fetch failed: ${servicesError.message}`)
      }
      console.log('✅ Services fetched:', servicesData?.length || 0)

      // Set data
      setBookings(bookingsData || [])
      setServices(servicesData || [])
      
      // Generate mock providers for demo
      const mockProviders: Provider[] = [
        {
          id: "1",
          name: "Beauty Haven Spa",
          rating: 4.8,
          review_count: 127,
          services: ["Facial", "Massage", "Manicure"],
          location: "Cape Town CBD",
          price_range: "R200-R800",
          availability: "Mon-Sat 9AM-7PM"
        },
        {
          id: "2",
          name: "Home Clean Pro",
          rating: 4.6,
          review_count: 89,
          services: ["Deep Cleaning", "Regular Cleaning", "Move-in/out"],
          location: "Johannesburg North",
          price_range: "R150-R500",
          availability: "Mon-Fri 8AM-6PM"
        },
        {
          id: "3",
          name: "Tech Fix Express",
          rating: 4.9,
          review_count: 203,
          services: ["Computer Repair", "Phone Repair", "Network Setup"],
          location: "Pretoria East",
          price_range: "R100-R1200",
          availability: "Mon-Sat 8AM-8PM"
        }
      ]
      
      setProviders(mockProviders)
      setRecentlyViewed(mockProviders.slice(0, 2))
      setFavorites(mockProviders.slice(0, 1))
      
      console.log('✅ All data set successfully')
      setConnectionStatus('connected')
      setLoading(false)
    } catch (error) {
      console.error('❌ Error fetching customer data:', error)
      setConnectionStatus('disconnected')
      setLoading(false)
    }
  }

  const getUpcomingBookings = () => {
    const today = new Date()
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.booking_date)
      return bookingDate >= today && booking.status !== 'cancelled'
    }).slice(0, 3)
  }

  const getPastBookings = () => {
    const today = new Date()
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.booking_date)
      return bookingDate < today || booking.status === 'cancelled'
    }).slice(0, 5)
  }

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getWeatherIcon = () => {
    // Mock weather - in real app, integrate with weather API
    return <Sun className="h-6 w-6 text-yellow-500" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading customer dashboard...</p>
          <p className="text-sm text-muted-foreground mt-2">Connecting to database...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Connection Status */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {userProfile.name}!</h1>
            <p className="text-muted-foreground">Manage your bookings, discover services, and track your spending</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'disconnected' ? 'bg-red-500' :
                'bg-yellow-500'
              }`}></div>
              <span className="text-sm text-muted-foreground">
                {connectionStatus === 'connected' ? 'Connected to Database' :
                 connectionStatus === 'disconnected' ? 'Database Disconnected' :
                 'Checking Connection...'}
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={fetchCustomerData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Book Service
            </Button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getUpcomingBookings().length}</div>
              <p className="text-xs text-muted-foreground">
                {getUpcomingBookings().filter(b => b.status === 'pending').length} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R{(bookings.length * 150).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Services Used</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">
                {bookings.filter(b => b.status === 'completed').length} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weather</CardTitle>
              {getWeatherIcon()}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">22°C</div>
              <p className="text-xs text-muted-foreground">Perfect for outdoor services</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Bookings</CardTitle>
                  <CardDescription>Your next appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getUpcomingBookings().map((booking, index) => (
                      <div key={booking.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">Service #{booking.id?.slice(0, 8) || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Provider #{booking.id?.slice(0, 8) || 'Unknown'}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getBookingStatusColor(booking.status)}>
                            {booking.status || 'Unknown'}
                          </Badge>
                          <p className="text-sm font-medium mt-1">
                            R150
                          </p>
                        </div>
                      </div>
                    ))}
                    {getUpcomingBookings().length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        No upcoming bookings. Book a service to get started!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book New Service
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Repeat className="h-4 w-4 mr-2" />
                    Rebook Last Service
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Provider
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    Leave Review
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Service Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Based on your booking history and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {services.slice(0, 3).map((service, index) => (
                    <Card key={service.id || index}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            {service.duration} min • R{service.price}
                          </div>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Book
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>All Bookings</CardTitle>
                    <CardDescription>Manage your appointments and service history</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking, index) => (
                    <div key={booking.id || index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">Service #{booking.id?.slice(0, 8) || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">
                              Provider #{booking.id?.slice(0, 8) || 'Unknown'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Location: Cape Town
                            </p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>{new Date(booking.booking_date).toLocaleDateString()}</p>
                            <p>{booking.booking_time}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getBookingStatusColor(booking.status)}>
                          {booking.status || 'Unknown'}
                        </Badge>
                        <p className="font-medium">R150</p>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Repeat className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No bookings found. Start by booking your first service!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Discover Services</CardTitle>
                <CardDescription>Find the perfect service provider for your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Search services, providers, or locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Button>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={filterCategory === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterCategory("all")}
                    >
                      All Categories
                    </Button>
                    <Button
                      variant={filterCategory === "beauty" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterCategory("beauty")}
                    >
                      Beauty & Wellness
                    </Button>
                    <Button
                      variant={filterCategory === "home" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterCategory("home")}
                    >
                      Home Services
                    </Button>
                    <Button
                      variant={filterCategory === "tech" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterCategory("tech")}
                    >
                      Tech Services
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Provider Listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        <CardDescription>{provider.location}</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{provider.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({provider.review_count} reviews)
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{provider.availability}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>{provider.price_range}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {provider.services.slice(0, 3).map((service, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Other tabs placeholder */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile & Preferences</CardTitle>
                <CardDescription>Manage your personal information and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Profile management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment & Financial</CardTitle>
                <CardDescription>Manage your payment methods and track spending</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Payment features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Support</CardTitle>
                <CardDescription>Get help when you need it</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Support features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage your alerts and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Notification features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Community & Social</CardTitle>
                <CardDescription>Connect with other users and share experiences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Community features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}