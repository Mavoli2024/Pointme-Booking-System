"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Clock,
  Star,
  Search,
  Bell,
  User,
  Heart,
  CreditCard,
  Receipt,
  MessageSquare,
  Download,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Activity,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  MessageSquare as MessageSquareIcon,
  Star as StarIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  DollarSign as DollarSignIcon,
  TrendingUp as TrendingUpIcon,
  Users as UsersIcon,
  Building2 as Building2Icon,
  Activity as ActivityIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  MoreHorizontal as MoreHorizontalIcon,
  Plus as PlusIcon,
  Edit as EditIcon,
  Trash2 as Trash2Icon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { 
  getBusinessDashboardData,
  getBusinessBookings,
  getBusinessServices,
  getBusinessFinancialData,
  getBusinessReviews,
  getBusinessStats,
  type BusinessDashboardData,
  type BusinessBookingData,
  type BusinessServiceData,
  type BusinessFinancialData,
  type BusinessReviewData,
  type BusinessStats
} from "@/lib/business-data"

export default function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [businessData, setBusinessData] = useState<BusinessDashboardData | null>(null)
  const [bookings, setBookings] = useState<BusinessBookingData[]>([])
  const [services, setServices] = useState<BusinessServiceData[]>([])
  const [financials, setFinancials] = useState<BusinessFinancialData | null>(null)
  const [reviews, setReviews] = useState<BusinessReviewData[]>([])
  const [stats, setStats] = useState<BusinessStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [businessEmail, setBusinessEmail] = useState<string>("")

  // Get business email from localStorage or authentication
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = JSON.parse(localStorage.getItem("userInfo") || "{}")
      const adminSession = localStorage.getItem("admin_session")

      if (!storedUser.email && adminSession !== "true") {
        // Redirect to login if no user found
        window.location.href = "/auth/sign-in"
        return
      }

      if (adminSession === "true") {
        // Redirect admin to admin dashboard
        window.location.href = "/admin/dashboard"
        return
      }

      // Use the logged-in user's email
      setBusinessEmail(storedUser.email)
    }

    checkAuth()
  }, [])

  // Fetch real data from Supabase
  useEffect(() => {
    if (!businessEmail) return

    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch all data in parallel
        const [dashboardData, bookingsData, servicesData, financialsData, reviewsData, statsData] = await Promise.all([
          getBusinessDashboardData(businessEmail),
          getBusinessBookings(businessEmail),
          getBusinessServices(businessEmail),
          getBusinessFinancialData(businessEmail),
          getBusinessReviews(businessEmail),
          getBusinessStats(businessEmail)
        ])

        setBusinessData(dashboardData)
        setBookings(bookingsData)
        setServices(servicesData)
        setFinancials(financialsData)
        setReviews(reviewsData)
        setStats(statsData)
      } catch (error) {
        console.error('Error fetching business data:', error)
        // Set empty data on error
        setBusinessData(null)
        setBookings([])
        setServices([])
        setFinancials(null)
        setReviews([])
        setStats(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [businessEmail])

  const filteredBookings = bookings.filter(booking => {
    if (filterStatus !== "all" && booking.status !== filterStatus) return false
    if (searchTerm && !booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!businessEmail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access your business dashboard.</p>
          <Link href="/auth/sign-in">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!businessData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Not Found</h2>
          <p className="text-gray-600 mb-4">We couldn't find your business data. Please contact support.</p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{businessData.name}</h1>
              <p className="text-gray-600">Business Dashboard - Manage your services and bookings</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{businessData.total_revenue}</div>
              <p className="text-xs text-muted-foreground">
                {businessData.total_bookings} bookings • R{businessData.average_booking_value} avg
              </p>
              <Progress value={(businessData.completed_bookings / businessData.total_bookings) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businessData.pending_bookings}</div>
              <p className="text-xs text-muted-foreground">
                {businessData.completed_bookings} completed • {businessData.cancelled_bookings} cancelled
              </p>
              <Progress value={(businessData.pending_bookings / businessData.total_bookings) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businessData.rating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                {businessData.total_reviews} reviews • {businessData.total_reviews > 0 ? 'Excellent' : 'No reviews yet'}
              </p>
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < Math.floor(businessData.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{businessData.pending_payouts}</div>
              <p className="text-xs text-muted-foreground">
                {businessData.commission_rate}% commission rate
              </p>
              <Progress value={(businessData.pending_payouts / businessData.total_revenue) * 100} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/business/dashboard/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Advanced Analytics
                </CardTitle>
                <CardDescription>Detailed business insights and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View revenue trends, customer analytics, and service performance
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/business/dashboard/bookings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Booking Management
                </CardTitle>
                <CardDescription>Real-time calendar and booking workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage bookings, update status, and view calendar
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/business/dashboard/financials">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Financial Reports
                </CardTitle>
                <CardDescription>Revenue tracking and financial analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track revenue, commissions, and financial performance
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest customer bookings and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {booking.customer_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {booking.customer_name} - {booking.service_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.booking_date} at {booking.booking_time} • R{booking.total_amount}
                          </p>
                        </div>
                        <Badge variant={booking.status === "completed" ? "default" : "secondary"}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Performance</CardTitle>
                  <CardDescription>Key performance indicators and metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completion Rate</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {businessData.total_bookings > 0 ? Math.round((businessData.completed_bookings / businessData.total_bookings) * 100) : 0}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Rating</span>
                      <Badge variant="default" className="bg-blue-100 text-blue-800">
                        <Star className="h-3 w-3 mr-1" />
                        {businessData.rating.toFixed(1)}/5
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Customers</span>
                      <Badge variant="default" className="bg-purple-100 text-purple-800">
                        <Users className="h-3 w-3 mr-1" />
                        {stats?.totalCustomers || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Services</span>
                      <Badge variant="default" className="bg-orange-100 text-orange-800">
                        <Building2 className="h-3 w-3 mr-1" />
                        {stats?.activeServices || 0}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common business tasks and operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Plus className="h-6 w-6 mb-2" />
                    <span className="text-sm">Add Service</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Calendar className="h-6 w-6 mb-2" />
                    <span className="text-sm">View Calendar</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <MessageSquare className="h-6 w-6 mb-2" />
                    <span className="text-sm">Messages</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    <span className="text-sm">Export Data</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Booking Management</CardTitle>
                    <CardDescription>Manage and track all customer bookings</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Calendar View
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex space-x-4 mb-6">
                  <Input
                    placeholder="Search by customer name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                  />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bookings Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.customer_name}</p>
                            <p className="text-sm text-muted-foreground">{booking.customer_email}</p>
                            <p className="text-xs text-muted-foreground">{booking.customer_phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{booking.service_name}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.booking_date}</p>
                            <p className="text-sm text-muted-foreground">{booking.booking_time}</p>
                          </div>
                        </TableCell>
                        <TableCell>R{booking.total_amount}</TableCell>
                        <TableCell>
                          <Badge variant={booking.status === "completed" ? "default" : "secondary"}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={booking.payment_status === "paid" ? "default" : "destructive"}>
                            {booking.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Service Management</CardTitle>
                    <CardDescription>Manage your service offerings and pricing</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {service.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                          <p className="text-xs text-muted-foreground">{service.category_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={service.is_active ? "default" : "secondary"}>
                          {service.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">R{service.price}</Badge>
                        <Badge variant="outline">{service.duration}min</Badge>
                        <Badge variant="outline">{service.total_bookings} bookings</Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financials" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R{financials?.total_revenue || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    All time business revenue
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R{financials?.total_commission || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Platform commission paid
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R{financials?.pending_payouts || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting platform payout
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{financials?.failed_payments || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Payment processing issues
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue and commission trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financials?.monthly_trends?.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{trend.month}</p>
                        <p className="text-sm text-muted-foreground">{trend.bookings} bookings</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">R{trend.revenue}</p>
                        <p className="text-sm text-muted-foreground">
                          R{trend.commission} commission
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Customer Reviews</CardTitle>
                    <CardDescription>Manage and respond to customer feedback</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Respond to All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <Avatar>
                        <AvatarFallback>
                          {review.customer_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <p className="font-medium">{review.customer_name}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <Badge variant="outline">{review.service_name}</Badge>
                          {review.is_verified && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                        <p className="text-xs text-muted-foreground">
                          {review.booking_date} • {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
