"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  MapPin,
  Phone,
  Mail,
  Settings,
  Plus,
  Edit,
  Filter,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { 
  getCustomerBookings,
  getCustomerPayments,
  getCustomerNotifications,
  getCustomerProfile,
  getCustomerStats,
  markNotificationAsRead,
  createBookingReview,
  type CustomerBookingData,
  type CustomerPaymentData,
  type CustomerNotificationData,
  type CustomerProfileData,
  type CustomerStats
} from "@/lib/customer-data"

export default function CustomerDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Data states
  const [upcomingBookings, setUpcomingBookings] = useState<CustomerBookingData[]>([])
  const [pastBookings, setPastBookings] = useState<CustomerBookingData[]>([])
  const [cancelledBookings, setCancelledBookings] = useState<CustomerBookingData[]>([])
  const [paymentHistory, setPaymentHistory] = useState<CustomerPaymentData[]>([])
  const [notifications, setNotifications] = useState<CustomerNotificationData[]>([])
  const [userProfile, setUserProfile] = useState<CustomerProfileData | null>(null)
  const [stats, setStats] = useState<CustomerStats>({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalSpent: 0,
    averageRating: 0,
    favoriteCategory: 'None',
    upcomingBookings: 0
  })
  
  // UI states
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  // Notification preferences
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    push: true,
    bookingReminders: true,
    promotions: false
  })

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("userInfo")
      const adminSession = localStorage.getItem("admin_session")

      if (!storedUser && adminSession !== "true") {
        router.push("/auth/login")
        return
      }

      if (adminSession === "true") {
        router.push("/admin/dashboard")
        return
      }
    }

    checkAuth()
    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const storedUser = JSON.parse(localStorage.getItem("userInfo") || "{}")
      const customerEmail = storedUser.email

      if (!customerEmail) {
        console.error("No customer email found")
        return
      }

      // Fetch all customer data in parallel
      const [bookingsData, paymentsData, notificationsData, profileData, statsData] = await Promise.all([
        getCustomerBookings(customerEmail),
        getCustomerPayments(customerEmail),
        getCustomerNotifications(customerEmail),
        getCustomerProfile(customerEmail),
        getCustomerStats(customerEmail)
      ])

      // Set profile data and form
      setUserProfile(profileData)
      if (profileData?.name) {
        const nameParts = profileData.name.split(" ")
        setProfileForm({
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
        })
      }

      // Categorize bookings
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const upcoming = bookingsData.filter(booking => {
        const bookingDate = new Date(booking.booking_date)
        return bookingDate >= today && booking.status !== "cancelled"
      })

      const past = bookingsData.filter(booking => {
        const bookingDate = new Date(booking.booking_date)
        return bookingDate < today && booking.status !== "cancelled"
      })

      const cancelled = bookingsData.filter(booking => booking.status === "cancelled")

      setUpcomingBookings(upcoming)
      setPastBookings(past)
      setCancelledBookings(cancelled)
      setPaymentHistory(paymentsData)
      setNotifications(notificationsData)
      setStats(statsData)

    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchDashboardData()
  }

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const supabase = createClient()
      await supabase.from("bookings").update({ status: "cancelled" }).eq("id", bookingId)
      fetchDashboardData()
    } catch (error) {
      console.error("Error cancelling booking:", error)
    }
  }

  const handleMarkNotificationAsRead = async (notificationId: string) => {
    try {
      const success = await markNotificationAsRead(notificationId)
      if (success) {
        fetchDashboardData()
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const supabase = createClient()
      const storedUser = JSON.parse(localStorage.getItem("userInfo") || "{}")
      
      if (storedUser.email) {
        await supabase.from("users").upsert({
          email: profileForm.email,
          name: `${profileForm.firstName} ${profileForm.lastName}`.trim(),
          phone: profileForm.phone,
        })
        fetchDashboardData()
      }
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }

  // Filter and sort bookings
  const allBookings = [...upcomingBookings, ...pastBookings, ...cancelledBookings]
  const filteredBookings = allBookings.filter(booking => {
    if (filterStatus !== "all" && booking.status !== filterStatus) return false
    if (searchQuery && !booking.service_name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !booking.business_name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime()
    }
    if (sortBy === "amount") {
      return b.total_amount - a.total_amount
    }
    return 0
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
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
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-foreground">PointMe</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services, providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="ghost" size="sm" className="relative" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell className="h-4 w-4" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    {notifications.filter(n => !n.read).length}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign Out
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="absolute top-20 right-4 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="p-2">
            {notifications.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleMarkNotificationAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Bell className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.read && <div className="h-2 w-2 bg-blue-500 rounded-full"></div>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userProfile?.name || "Customer"}!
          </h1>
          <p className="text-muted-foreground">Manage your bookings and discover new services</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingBookings.length}</div>
              <p className="text-xs text-muted-foreground">
                {upcomingBookings.length > 0
                  ? `Next: ${new Date(upcomingBookings[0]?.booking_date).toLocaleDateString()}`
                  : "No upcoming bookings"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">From {stats.completedBookings} reviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{stats.totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest bookings and activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sortedBookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {booking.business_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {booking.service_name} at {booking.business_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(booking.booking_date).toLocaleDateString()} • R{booking.total_amount}
                          </p>
                        </div>
                        <Badge variant={booking.status === "completed" ? "default" : "secondary"}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                    {sortedBookings.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        No bookings yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/services">
                      <Button variant="outline" className="h-20 flex-col w-full">
                        <Calendar className="h-6 w-6 mb-2" />
                        <span className="text-sm">Book Service</span>
                      </Button>
                    </Link>
                    <Link href="/services">
                      <Button variant="outline" className="h-20 flex-col w-full">
                        <Search className="h-6 w-6 mb-2" />
                        <span className="text-sm">Find Providers</span>
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button variant="outline" className="h-20 flex-col w-full">
                        <MessageSquare className="h-6 w-6 mb-2" />
                        <span className="text-sm">Support</span>
                      </Button>
                    </Link>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab("profile")}>
                      <Settings className="h-6 w-6 mb-2" />
                      <span className="text-sm">Settings</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Booking Management</CardTitle>
                    <CardDescription>Manage and track all your bookings</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Link href="/services">
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Book New Service
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex space-x-4 mb-6">
                  <Input
                    placeholder="Search bookings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                  {sortedBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No bookings found</p>
                      <Link href="/services">
                        <Button className="mt-4">Browse Services</Button>
                      </Link>
                    </div>
                  ) : (
                    sortedBookings.map((booking) => (
                      <div key={booking.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarFallback>
                                {booking.business_name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <h3 className="font-semibold">{booking.service_name}</h3>
                              <p className="text-sm text-muted-foreground">{booking.business_name}</p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{booking.booking_time}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <div className="text-lg font-semibold">R{booking.total_amount}</div>
                            <Badge variant={booking.status === "completed" ? "default" : "secondary"}>
                              {booking.status}
                            </Badge>
                            <div className="flex space-x-2">
                              {booking.status === "confirmed" && (
                                <Button variant="ghost" size="sm" onClick={() => handleCancelBooking(booking.id)}>
                                  Cancel
                                </Button>
                              )}
                              {booking.status === "completed" && (
                                <Button size="sm">Review</Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Your transaction history and receipts</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No payment history</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{payment.booking.service_name}</h3>
                            <p className="text-sm text-muted-foreground">{payment.booking.business_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(payment.created_at).toLocaleDateString()} • {payment.payment_method}
                            </p>
                          </div>
                          <div className="text-right space-y-2">
                            <div className="text-lg font-semibold">R{payment.amount}</div>
                            <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                              {payment.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Receipt
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Providers</CardTitle>
                <CardDescription>Your saved service providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No favorite providers yet</p>
                  <Link href="/services">
                    <Button className="mt-4">Discover Services</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Center</CardTitle>
                <CardDescription>Stay updated with your bookings and account</CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`border border-border rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${
                          !notification.read ? "bg-blue-50" : ""
                        }`}
                        onClick={() => handleMarkNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {!notification.read && <div className="h-2 w-2 bg-blue-500 rounded-full"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Manage your account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarFallback>
                          {profileForm.firstName?.[0] || userProfile?.name?.[0] || "U"}
                          {profileForm.lastName?.[0] || ""}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {profileForm.firstName} {profileForm.lastName}
                        </h3>
                        <p className="text-muted-foreground">{profileForm.email}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Change Photo
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <Input
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                          placeholder="Enter your last name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          placeholder="Enter your email"
                          type="email"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone</label>
                        <Input
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notificationSettings.email}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, email: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={notificationSettings.sms}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, sms: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive push notifications</p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={notificationSettings.push}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, push: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="booking-reminders">Booking Reminders</Label>
                        <p className="text-sm text-muted-foreground">Get reminded about upcoming bookings</p>
                      </div>
                      <Switch
                        id="booking-reminders"
                        checked={notificationSettings.bookingReminders}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, bookingReminders: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}