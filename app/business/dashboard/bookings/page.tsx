"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { 
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  MessageSquare,
  Download,
  Filter,
  Search,
  Plus,
  Settings,
  Users,
  DollarSign,
  TrendingUp,
  Eye
} from "lucide-react"
import { createClient } from "@/lib/supabase"

interface Booking {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  service_name: string
  booking_date: string
  booking_time: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  total_amount: number
  special_requests?: string
  created_at: string
  service_id: string
  business_id: string
}

interface Service {
  id: string
  name: string
  duration: number
  price: number
  description: string
}

export default function BusinessBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [businessEmail, setBusinessEmail] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showBookingDetails, setShowBookingDetails] = useState(false)

  useEffect(() => {
    // Get business email from localStorage or auth context
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      const user = JSON.parse(userInfo)
      setBusinessEmail(user.email)
    }
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const supabase = createClient()
      
      // Fetch business data
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('email', businessEmail)
        .single()

      if (businessError) throw businessError

      // Fetch bookings with service details
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          service:services(name)
        `)
        .eq('business_id', businessData.id)
        .order('created_at', { ascending: false })

      if (bookingsError) throw bookingsError

      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businessData.id)

      if (servicesError) throw servicesError

      const formattedBookings: Booking[] = bookingsData?.map((booking: any) => ({
        id: booking.id,
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        customer_phone: booking.customer_phone,
        service_name: booking.service?.name || "Unknown Service",
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        status: booking.status,
        total_amount: booking.total_amount,
        special_requests: booking.special_requests,
        created_at: booking.created_at,
        service_id: booking.service_id,
        business_id: booking.business_id
      })) || []

      setBookings(formattedBookings)
      setServices(servicesData || [])

    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)

      if (error) throw error

      // Refresh bookings
      fetchBookings()

    } catch (error) {
      console.error('Error updating booking status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'in-progress': return <Clock className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = selectedStatus === "all" || booking.status === selectedStatus
    const matchesSearch = searchQuery === "" || 
      booking.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDate = !selectedDate || booking.booking_date === selectedDate.toISOString().split('T')[0]
    
    return matchesStatus && matchesSearch && matchesDate
  })

  const getBookingsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return bookings.filter(booking => booking.booking_date === dateString)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bookings...</p>
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
              <h1 className="text-3xl font-bold text-foreground">Booking Management</h1>
              <p className="text-muted-foreground">Manage and track all your customer bookings</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Calendar View */}
          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Calendar</CardTitle>
                    <CardDescription>View and manage bookings by date</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                      modifiers={{
                        booked: (date) => getBookingsForDate(date).length > 0
                      }}
                      modifiersStyles={{
                        booked: { backgroundColor: 'hsl(var(--primary) / 0.1)' }
                      }}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Filters and Stats */}
              <div className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="search">Search</Label>
                      <div className="relative mt-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Search bookings..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Bookings</span>
                      <Badge variant="secondary">{bookings.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pending</span>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        {bookings.filter(b => b.status === 'pending').length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Today</span>
                      <Badge variant="outline">
                        {getBookingsForDate(new Date()).length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Week</span>
                      <Badge variant="outline">
                        {bookings.filter(b => {
                          const bookingDate = new Date(b.booking_date)
                          const weekAgo = new Date()
                          weekAgo.setDate(weekAgo.getDate() - 7)
                          return bookingDate >= weekAgo
                        }).length}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Selected Date Bookings */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Bookings for {selectedDate.toLocaleDateString()}
                  </CardTitle>
                  <CardDescription>
                    {getBookingsForDate(selectedDate).length} bookings scheduled
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getBookingsForDate(selectedDate).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-lg font-bold">{booking.booking_time}</div>
                            <div className="text-sm text-muted-foreground">{booking.service_name}</div>
                          </div>
                          <div>
                            <div className="font-medium">{booking.customer_name}</div>
                            <div className="text-sm text-muted-foreground">{booking.customer_email}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1">{booking.status}</span>
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking)
                              setShowBookingDetails(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {getBookingsForDate(selectedDate).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No bookings scheduled for this date
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* List View */}
          <TabsContent value="list" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>Manage and track all customer bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search bookings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-bold">{booking.booking_time}</div>
                          <div className="text-sm text-muted-foreground">{booking.booking_date}</div>
                        </div>
                        <div>
                          <div className="font-medium">{booking.customer_name}</div>
                          <div className="text-sm text-muted-foreground">{booking.service_name}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {booking.customer_phone}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="font-semibold">R{booking.total_amount}</div>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1">{booking.status}</span>
                          </Badge>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking)
                              setShowBookingDetails(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredBookings.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <CalendarIcon className="h-16 w-16 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                      <p>Try adjusting your search criteria or filters</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    All time bookings
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bookings.filter(b => b.status === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting confirmation
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bookings.filter(b => b.status === 'completed').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Successfully completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R{bookings.reduce((sum, b) => sum + b.total_amount, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total revenue
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Details Modal */}
      {showBookingDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Booking Details</h2>
              <Button variant="outline" onClick={() => setShowBookingDetails(false)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer Name</Label>
                  <p className="font-medium">{selectedBooking.customer_name}</p>
                </div>
                <div>
                  <Label>Service</Label>
                  <p className="font-medium">{selectedBooking.service_name}</p>
                </div>
                <div>
                  <Label>Date & Time</Label>
                  <p className="font-medium">{selectedBooking.booking_date} at {selectedBooking.booking_time}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedBooking.status)}>
                    {getStatusIcon(selectedBooking.status)}
                    <span className="ml-1">{selectedBooking.status}</span>
                  </Badge>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{selectedBooking.customer_email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="font-medium">{selectedBooking.customer_phone}</p>
                </div>
                <div>
                  <Label>Amount</Label>
                  <p className="font-medium">R{selectedBooking.total_amount}</p>
                </div>
              </div>

              {selectedBooking.special_requests && (
                <div>
                  <Label>Special Requests</Label>
                  <p className="text-sm text-muted-foreground">{selectedBooking.special_requests}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Customer
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Booking
                  </Button>
                </div>
                <div className="flex space-x-2">
                  {selectedBooking.status === 'pending' && (
                    <Button onClick={() => updateBookingStatus(selectedBooking.id, 'confirmed')}>
                      Confirm Booking
                    </Button>
                  )}
                  {selectedBooking.status === 'confirmed' && (
                    <Button onClick={() => updateBookingStatus(selectedBooking.id, 'in-progress')}>
                      Start Service
                    </Button>
                  )}
                  {selectedBooking.status === 'in-progress' && (
                    <Button onClick={() => updateBookingStatus(selectedBooking.id, 'completed')}>
                      Complete Service
                    </Button>
                  )}
                  {['pending', 'confirmed'].includes(selectedBooking.status) && (
                    <Button variant="destructive" onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled')}>
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

