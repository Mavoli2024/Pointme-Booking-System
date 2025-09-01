"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
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
  LineChart,
  Activity,
  Bell,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw
} from "lucide-react"
import { createClient } from "@/lib/supabase"

export default function BusinessDashboard() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  
  // Data states
  const [bookings, setBookings] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [staff, setStaff] = useState<any[]>([])
  const [supportTickets, setSupportTickets] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [businessStats, setBusinessStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    averageRating: 0
  })

  useEffect(() => {
    fetchBusinessData()
  }, [])

  const fetchBusinessData = async () => {
    try {
      const supabase = createClient()
      
      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          users!bookings_user_id_fkey (
            id,
            name,
            email,
            phone
          ),
          services!bookings_service_id_fkey (
            id,
            name,
            price,
            duration
          )
        `)
        .order('created_at', { ascending: false })

      if (bookingsError) throw bookingsError

      // Fetch users (customers)
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'customer')
        .order('created_at', { ascending: false })

      if (usersError) throw usersError

      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false })

      if (servicesError) throw servicesError

      // Fetch staff (users with business role)
      const { data: staffData, error: staffError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'business')
        .order('created_at', { ascending: false })

      if (staffError) throw staffError

      // Fetch support tickets (if table exists)
      let ticketsData = []
      try {
        const { data: tickets, error: ticketsError } = await supabase
          .from('support_tickets')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (!ticketsError) {
          ticketsData = tickets || []
        }
      } catch (e) {
        // Table might not exist yet
        ticketsData = []
      }

      // Fetch reviews (if table exists)
      let reviewsData = []
      try {
        const { data: reviews, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (!reviewsError) {
          reviewsData = reviews || []
        }
      } catch (e) {
        // Table might not exist yet
        reviewsData = []
      }

      // Calculate business stats
      const totalBookings = bookingsData?.length || 0
      const totalRevenue = bookingsData?.reduce((sum, booking) => {
        const service = booking.services
        return sum + (service?.price || 0)
      }, 0) || 0
      const totalCustomers = usersData?.length || 0
      const averageRating = reviewsData?.length > 0 
        ? (reviewsData.reduce((sum, review) => sum + (review.rating || 0), 0) / reviewsData.length).toFixed(1)
        : 0

      setBookings(bookingsData || [])
      setUsers(usersData || [])
      setServices(servicesData || [])
      setStaff(staffData || [])
      setSupportTickets(ticketsData)
      setReviews(reviewsData)
      setBusinessStats({
        totalBookings,
        totalRevenue,
        totalCustomers,
        averageRating: parseFloat(averageRating)
      })
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching business data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Business Dashboard</h1>
            <p className="text-muted-foreground">Manage your business operations and track performance</p>
          </div>
                     <div className="flex space-x-3">
             <Button variant="outline" onClick={fetchBusinessData}>
               <RefreshCw className="h-4 w-4 mr-2" />
               Refresh Data
             </Button>
             <Button variant="outline">
               <Download className="h-4 w-4 mr-2" />
               Export Report
             </Button>
             <Button>
               <Plus className="h-4 w-4 mr-2" />
               New Service
             </Button>
           </div>
        </div>

                 {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
               <Calendar className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{businessStats.totalBookings}</div>
               <p className="text-xs text-muted-foreground">
                 {bookings.filter(b => b.status === 'pending').length} pending
               </p>
             </CardContent>
           </Card>

           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
               <DollarSign className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">R{businessStats.totalRevenue.toLocaleString()}</div>
               <p className="text-xs text-muted-foreground">
                 {bookings.length > 0 ? 'From all bookings' : 'No bookings yet'}
               </p>
             </CardContent>
           </Card>

           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
               <Users className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{businessStats.totalCustomers}</div>
               <p className="text-xs text-muted-foreground">
                 {users.filter(u => new Date(u.created_at).getMonth() === new Date().getMonth()).length} new this month
               </p>
             </CardContent>
           </Card>

           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
               <Star className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{businessStats.averageRating}</div>
               <p className="text-xs text-muted-foreground">
                 Based on {reviews.length} reviews
               </p>
             </CardContent>
           </Card>
         </div>

         {/* Main Content Tabs */}
         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
           <TabsList className="grid w-full grid-cols-9">
             <TabsTrigger value="overview">Overview</TabsTrigger>
             <TabsTrigger value="bookings">Bookings</TabsTrigger>
             <TabsTrigger value="services">Services</TabsTrigger>
             <TabsTrigger value="staff">Staff</TabsTrigger>
             <TabsTrigger value="calendar">Calendar</TabsTrigger>
             <TabsTrigger value="support">Support</TabsTrigger>
             <TabsTrigger value="reviews">Reviews</TabsTrigger>
             <TabsTrigger value="analytics">Analytics</TabsTrigger>
             <TabsTrigger value="settings">Settings</TabsTrigger>
           </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest customer appointments</CardDescription>
                </CardHeader>
                                 <CardContent>
                   <div className="space-y-4">
                     {bookings.slice(0, 3).map((booking, index) => (
                       <div key={booking.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                         <div className="flex-1">
                           <p className="font-medium">{booking.users?.name || 'Unknown Customer'}</p>
                           <p className="text-sm text-muted-foreground">
                             {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                           </p>
                           <p className="text-sm text-muted-foreground">
                             {booking.services?.name || 'Unknown Service'}
                           </p>
                         </div>
                         <div className="text-right">
                           <Badge className={`${
                             booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                             booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                             'bg-gray-100 text-gray-800'
                           }`}>
                             {booking.status || 'Unknown'}
                           </Badge>
                           <p className="text-sm font-medium mt-1">
                             R{booking.services?.price || 0}
                           </p>
                         </div>
                       </div>
                     ))}
                     {bookings.length === 0 && (
                       <div className="text-center py-4 text-muted-foreground">
                         No bookings yet
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
                    View Calendar
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Service
                  </Button>
                                     <Button variant="outline" className="w-full justify-start">
                     <MessageSquare className="h-4 w-4 mr-2" />
                     Send Notifications
                   </Button>
                   <Button variant="outline" className="w-full justify-start">
                     <Users className="h-4 w-4 mr-2" />
                     Manage Staff
                   </Button>
                   <Button variant="outline" className="w-full justify-start">
                     <Calendar className="h-4 w-4 mr-2" />
                     View Schedule
                   </Button>
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
                    <CardTitle>All Bookings</CardTitle>
                    <CardDescription>Manage customer appointments</CardDescription>
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
                             <p className="font-medium">{booking.users?.name || 'Unknown Customer'}</p>
                             <p className="text-sm text-muted-foreground">{booking.users?.email || 'No email'}</p>
                             <p className="text-sm text-muted-foreground">{booking.users?.phone || 'No phone'}</p>
                           </div>
                           <div className="text-sm text-muted-foreground">
                             <p>{new Date(booking.booking_date).toLocaleDateString()}</p>
                             <p>{booking.booking_time}</p>
                           </div>
                         </div>
                       </div>
                       <div className="flex items-center space-x-2">
                         <Badge className={`${
                           booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                           booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                           'bg-gray-100 text-gray-800'
                         }`}>
                           {booking.status || 'Unknown'}
                         </Badge>
                         <p className="font-medium">R{booking.services?.price || 0}</p>
                         <Button variant="outline" size="sm">
                           <Eye className="h-4 w-4" />
                         </Button>
                         <Button variant="outline" size="sm">
                           <Edit className="h-4 w-4" />
                         </Button>
                       </div>
                     </div>
                   ))}
                   {bookings.length === 0 && (
                     <div className="text-center py-8 text-muted-foreground">
                       No bookings found
                     </div>
                   )}
                 </div>
               </CardContent>
            </Card>
          </TabsContent>

                     {/* Services Tab */}
           <TabsContent value="services" className="space-y-6">
             <Card>
               <CardHeader>
                 <div className="flex justify-between items-center">
                   <div>
                     <CardTitle>Services</CardTitle>
                     <CardDescription>Manage your service offerings and assign staff</CardDescription>
                   </div>
                   <Button>
                     <Plus className="h-4 w-4 mr-2" />
                     Add Service
                   </Button>
                 </div>
               </CardHeader>
                                <CardContent>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {services.map((service, index) => (
                       <Card key={service.id || index}>
                         <CardHeader>
                           <div className="flex justify-between items-start">
                             <div>
                               <CardTitle className="text-lg">{service.name || 'Unnamed Service'}</CardTitle>
                               <CardDescription>{service.description || 'No description available'}</CardDescription>
                             </div>
                             <Badge variant="default">{service.status || 'Active'}</Badge>
                           </div>
                         </CardHeader>
                         <CardContent>
                           <div className="space-y-2">
                             <div className="flex justify-between text-sm">
                               <span>Price:</span>
                               <span className="font-medium">R{service.price || 0}</span>
                             </div>
                             <div className="flex justify-between text-sm">
                               <span>Duration:</span>
                               <span className="font-medium">{service.duration || 0} min</span>
                             </div>
                             <div className="flex justify-between text-sm">
                               <span>Category:</span>
                               <span className="font-medium">{service.category_id || 'Uncategorized'}</span>
                             </div>
                             <div className="flex justify-between text-sm">
                               <span>Bookings:</span>
                               <span className="font-medium">
                                 {bookings.filter(b => b.service_id === service.id).length}
                               </span>
                             </div>
                             <div className="flex justify-between text-sm">
                               <span>Revenue:</span>
                               <span className="font-medium">
                                 R{bookings.filter(b => b.service_id === service.id)
                                   .reduce((sum, b) => sum + (b.services?.price || 0), 0)}
                               </span>
                             </div>
                           </div>
                           <div className="flex space-x-2 mt-4">
                             <Button variant="outline" size="sm" className="flex-1">
                               <Edit className="h-4 w-4 mr-2" />
                               Edit
                             </Button>
                             <Button variant="outline" size="sm" className="flex-1">
                               <Eye className="h-4 w-4 mr-2" />
                               View
                             </Button>
                           </div>
                         </CardContent>
                       </Card>
                     ))}
                     {services.length === 0 && (
                       <div className="col-span-full text-center py-8 text-muted-foreground">
                         No services found. Create your first service to get started.
                       </div>
                     )}
                   </div>
                 </CardContent>
             </Card>
           </TabsContent>

           {/* Staff Management Tab */}
           <TabsContent value="staff" className="space-y-6">
             <Card>
               <CardHeader>
                 <div className="flex justify-between items-center">
                   <div>
                     <CardTitle>Staff Management</CardTitle>
                     <CardDescription>Manage your team members, roles, and schedules</CardDescription>
                   </div>
                   <Button>
                     <Plus className="h-4 w-4 mr-2" />
                     Add Staff Member
                   </Button>
                 </div>
               </CardHeader>
               <CardContent>
                                    <div className="space-y-4">
                     {/* Staff List */}
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {staff.map((member, index) => (
                         <Card key={member.id || index}>
                           <CardHeader className="pb-3">
                             <div className="flex items-center space-x-3">
                               <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                 <Users className="h-6 w-6 text-primary" />
                               </div>
                               <div>
                                 <CardTitle className="text-lg">{member.name || 'Unnamed Staff'}</CardTitle>
                                 <CardDescription>{member.role || 'Staff Member'}</CardDescription>
                               </div>
                             </div>
                           </CardHeader>
                           <CardContent className="space-y-3">
                             <div className="flex justify-between text-sm">
                               <span>Status:</span>
                               <Badge className="bg-green-100 text-green-800">Active</Badge>
                             </div>
                             <div className="flex justify-between text-sm">
                               <span>Email:</span>
                               <span className="font-medium">{member.email || 'No email'}</span>
                             </div>
                             <div className="flex justify-between text-sm">
                               <span>Phone:</span>
                               <span className="font-medium">{member.phone || 'No phone'}</span>
                             </div>
                             <div className="flex justify-between text-sm">
                               <span>Joined:</span>
                               <span className="font-medium">
                                 {new Date(member.created_at).toLocaleDateString()}
                               </span>
                             </div>
                             <div className="flex space-x-2 mt-3">
                               <Button variant="outline" size="sm" className="flex-1">
                                 <Edit className="h-4 w-4 mr-2" />
                                 Edit
                               </Button>
                               <Button variant="outline" size="sm" className="flex-1">
                                 <Calendar className="h-4 w-4 mr-2" />
                                 Schedule
                               </Button>
                             </div>
                           </CardContent>
                         </Card>
                       ))}
                       {staff.length === 0 && (
                         <div className="col-span-full text-center py-8 text-muted-foreground">
                           No staff members found. Add staff members to get started.
                         </div>
                       )}
                     </div>

                                        {/* Staff Statistics */}
                     <Card>
                       <CardHeader>
                         <CardTitle>Staff Overview</CardTitle>
                         <CardDescription>Quick statistics about your team</CardDescription>
                       </CardHeader>
                       <CardContent>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           <div className="text-center">
                             <div className="text-2xl font-bold text-primary">{staff.length}</div>
                             <div className="text-sm text-muted-foreground">Total Staff</div>
                           </div>
                           <div className="text-center">
                             <div className="text-2xl font-bold text-green-600">
                               {staff.filter(s => s.role === 'business').length}
                             </div>
                             <div className="text-sm text-muted-foreground">Business Staff</div>
                           </div>
                           <div className="text-center">
                             <div className="text-2xl font-bold text-yellow-600">
                               {staff.filter(s => s.role === 'staff').length}
                             </div>
                             <div className="text-sm text-muted-foreground">Service Staff</div>
                           </div>
                           <div className="text-center">
                             <div className="text-2xl font-bold text-blue-600">
                               {staff.length > 0 ? 'Active' : 'None'}
                             </div>
                             <div className="text-sm text-muted-foreground">Status</div>
                           </div>
                         </div>
                       </CardContent>
                     </Card>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>

                     {/* Staff Calendar Tab */}
           <TabsContent value="calendar" className="space-y-6">
             <Card>
               <CardHeader>
                 <div className="flex justify-between items-center">
                   <div>
                     <CardTitle>Staff Calendar & Scheduling</CardTitle>
                     <CardDescription>Manage staff schedules, availability, and time-off requests</CardDescription>
                   </div>
                   <div className="flex space-x-2">
                     <Button variant="outline">
                       <Calendar className="h-4 w-4 mr-2" />
                       View Calendar
                     </Button>
                     <Button>
                       <Plus className="h-4 w-4 mr-2" />
                       Add Schedule
                     </Button>
                   </div>
                 </div>
               </CardHeader>
               <CardContent>
                 <div className="space-y-6">
                   {/* Calendar View */}
                   <Card>
                     <CardHeader>
                       <CardTitle>Weekly Schedule</CardTitle>
                       <CardDescription>Current week's staff schedule</CardDescription>
                     </CardHeader>
                     <CardContent>
                       <div className="overflow-x-auto">
                         <table className="w-full border-collapse">
                           <thead>
                             <tr className="border-b">
                               <th className="text-left p-3 font-medium">Staff</th>
                               <th className="text-left p-3 font-medium">Monday</th>
                               <th className="text-left p-3 font-medium">Tuesday</th>
                               <th className="text-left p-3 font-medium">Wednesday</th>
                               <th className="text-left p-3 font-medium">Thursday</th>
                               <th className="text-left p-3 font-medium">Friday</th>
                               <th className="text-left p-3 font-medium">Saturday</th>
                               <th className="text-left p-3 font-medium">Sunday</th>
                             </tr>
                           </thead>
                           <tbody>
                             <tr className="border-b">
                               <td className="p-3 font-medium">Sarah Johnson</td>
                               <td className="p-3">
                                 <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                   9AM-6PM
                                 </div>
                               </td>
                               <td className="p-3">
                                 <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                   9AM-6PM
                                 </div>
                               </td>
                               <td className="p-3">
                                 <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                   9AM-6PM
                                 </div>
                               </td>
                               <td className="p-3">
                                 <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                   9AM-6PM
                                 </div>
                               </td>
                               <td className="p-3">
                                 <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                   9AM-6PM
                                 </div>
                               </td>
                               <td className="p-3">
                                 <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                   Off
                                 </div>
                               </td>
                               <td className="p-3">
                                 <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                   Off
                                 </div>
                               </td>
                             </tr>
                             <tr className="border-b">
                               <td className="p-3 font-medium">Mike Chen</td>
                               <td className="p-3">
                                 <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                   10AM-7PM
                                 </div>
                               </td>
                               <td className="p-3">
                                 <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                   10AM-7PM
                                 </div>
                               </td>
                               <td className="p-3">
                                 <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                   10AM-7PM
                                 </div>
                               </td>
                               <td className="p-3">
                                 <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                   10AM-7PM
                                 </div>
                               </td>
                               <td className="p-3">
                                 <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                   10AM-7PM
                                 </div>
                               </td>
                               <td className="p-3">
                                 <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                   10AM-7PM
                                 </div>
                               </td>
                               <td className="p-3">
                                 <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                   Off
                                 </div>
                               </td>
                             </tr>
                             <tr className="border-b">
                               <td className="p-3 font-medium">Lisa Rodriguez</td>
                               <td className="p-3">
                                 <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                   2PM-6PM
                                 </div>
                               </td>
                               <td className="p-3">
                                 <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                   2PM-6PM
                                 </div>
                               </td>
                               <td className="p-3">
                                 <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                   2PM-6PM
                                 </div>
                               </td>
                               <td className="p-3">
                                 <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                   2PM-6PM
                                 </div>
                               </td>
                               <td className="p-3">
                                 <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                   2PM-6PM
                                 </div>
                               </td>
                               <td className="p-3">
                                 <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                   Off
                                 </div>
                               </td>
                               <td className="p-3">
                                 <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                   Off
                                 </div>
                               </td>
                             </tr>
                           </tbody>
                         </table>
                       </div>
                     </CardContent>
                   </Card>

                   {/* Time-off Requests */}
                   <Card>
                     <CardHeader>
                       <CardTitle>Time-off Requests</CardTitle>
                       <CardDescription>Pending and approved time-off requests</CardDescription>
                     </CardHeader>
                     <CardContent>
                       <div className="space-y-3">
                         <div className="flex items-center justify-between p-3 border rounded-lg">
                           <div className="flex-1">
                             <p className="font-medium">Sarah Johnson</p>
                             <p className="text-sm text-muted-foreground">Vacation Request</p>
                             <p className="text-sm text-muted-foreground">Dec 20-27, 2024</p>
                           </div>
                           <div className="text-right">
                             <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                             <p className="text-sm text-muted-foreground mt-1">7 days</p>
                           </div>
                         </div>
                         <div className="flex items-center justify-between p-3 border rounded-lg">
                           <div className="flex-1">
                             <p className="font-medium">Mike Chen</p>
                             <p className="text-sm text-muted-foreground">Personal Day</p>
                             <p className="text-sm text-muted-foreground">Dec 15, 2024</p>
                           </div>
                           <div className="text-right">
                             <Badge className="bg-green-100 text-green-800">Approved</Badge>
                             <p className="text-sm text-muted-foreground mt-1">1 day</p>
                           </div>
                         </div>
                       </div>
                     </CardContent>
                   </Card>

                   {/* Quick Actions */}
                   <Card>
                     <CardHeader>
                       <CardTitle>Quick Actions</CardTitle>
                       <CardDescription>Common scheduling tasks</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-3">
                       <Button variant="outline" className="w-full justify-start">
                         <Calendar className="h-4 w-4 mr-2" />
                         Set Regular Hours
                       </Button>
                       <Button variant="outline" className="w-full justify-start">
                         <Users className="h-4 w-4 mr-2" />
                         Assign Staff to Services
                       </Button>
                       <Button variant="outline" className="w-full justify-start">
                         <Clock className="h-4 w-4 mr-2" />
                         Manage Break Times
                       </Button>
                       <Button variant="outline" className="w-full justify-start">
                         <AlertTriangle className="h-4 w-4 mr-2" />
                         Handle Conflicts
                       </Button>
                     </CardContent>
                   </Card>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>

           {/* Customer Support Tab */}
           <TabsContent value="support" className="space-y-6">
             <Card>
               <CardHeader>
                 <div className="flex justify-between items-center">
                   <div>
                     <CardTitle>Customer Support Tickets</CardTitle>
                     <CardDescription>Manage customer inquiries, complaints, and support requests</CardDescription>
                   </div>
                   <div className="flex space-x-2">
                     <Button variant="outline">
                       <Filter className="h-4 w-4 mr-2" />
                       Filter
                     </Button>
                     <Button>
                       <Plus className="h-4 w-4 mr-2" />
                       New Ticket
                     </Button>
                   </div>
                 </div>
               </CardHeader>
               <CardContent>
                 <div className="space-y-6">
                                        {/* Support Statistics */}
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                       <Card>
                         <CardHeader className="pb-2">
                           <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                         </CardHeader>
                         <CardContent>
                           <div className="text-2xl font-bold text-orange-600">
                             {supportTickets.filter(t => t.status === 'open').length}
                           </div>
                           <p className="text-xs text-muted-foreground">Requires attention</p>
                         </CardContent>
                       </Card>
                       <Card>
                         <CardHeader className="pb-2">
                           <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                         </CardHeader>
                         <CardContent>
                           <div className="text-2xl font-bold text-blue-600">
                             {supportTickets.filter(t => t.status === 'in_progress').length}
                           </div>
                           <p className="text-xs text-muted-foreground">Being handled</p>
                         </CardContent>
                       </Card>
                       <Card>
                         <CardHeader className="pb-2">
                           <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                         </CardHeader>
                         <CardContent>
                           <div className="text-2xl font-bold text-green-600">
                             {supportTickets.filter(t => t.status === 'resolved').length}
                           </div>
                           <p className="text-xs text-muted-foreground">This month</p>
                         </CardContent>
                       </Card>
                       <Card>
                         <CardHeader className="pb-2">
                           <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                         </CardHeader>
                         <CardContent>
                           <div className="text-2xl font-bold text-purple-600">{supportTickets.length}</div>
                           <p className="text-xs text-muted-foreground">All time</p>
                         </CardContent>
                       </Card>
                     </div>

                                        {/* Active Tickets */}
                     <Card>
                       <CardHeader>
                         <CardTitle>Active Support Tickets</CardTitle>
                         <CardDescription>Recent customer support requests</CardDescription>
                       </CardHeader>
                       <CardContent>
                         <div className="space-y-4">
                           {supportTickets.slice(0, 5).map((ticket, index) => (
                             <div key={ticket.id || index} className="flex items-center justify-between p-4 border rounded-lg">
                               <div className="flex-1">
                                 <div className="flex items-center space-x-3">
                                   <Badge className={`${
                                     ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                                     ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                     'bg-blue-100 text-blue-800'
                                   }`}>
                                     {ticket.priority || 'Low'} Priority
                                   </Badge>
                                   <Badge className={`${
                                     ticket.status === 'open' ? 'bg-orange-100 text-orange-800' :
                                     ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                     'bg-green-100 text-green-800'
                                   }`}>
                                     {ticket.status || 'Open'}
                                   </Badge>
                                 </div>
                                 <h4 className="font-medium mt-2">{ticket.subject || 'No Subject'}</h4>
                                 <p className="text-sm text-muted-foreground">
                                   Customer: {ticket.customer_name || 'Unknown'}
                                 </p>
                                 <p className="text-sm text-muted-foreground mt-1">
                                   {ticket.description || 'No description available'}
                                 </p>
                               </div>
                               <div className="text-right">
                                 <p className="text-sm text-muted-foreground">
                                   {new Date(ticket.created_at).toLocaleDateString()}
                                 </p>
                                 <p className="text-sm text-muted-foreground">
                                   {new Date(ticket.created_at).toLocaleTimeString()}
                                 </p>
                                 <div className="flex space-x-2 mt-2">
                                   <Button variant="outline" size="sm">
                                     <Eye className="h-4 w-4 mr-2" />
                                     View
                                   </Button>
                                   <Button variant="outline" size="sm">
                                     <MessageSquare className="h-4 w-4 mr-2" />
                                     Reply
                                   </Button>
                                 </div>
                               </div>
                             </div>
                           ))}
                           {supportTickets.length === 0 && (
                             <div className="text-center py-8 text-muted-foreground">
                               No support tickets found
                             </div>
                           )}
                         </div>
                       </CardContent>
                     </Card>

                   {/* Quick Actions */}
                   <Card>
                     <CardHeader>
                       <CardTitle>Quick Actions</CardTitle>
                       <CardDescription>Common support tasks</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-3">
                       <Button variant="outline" className="w-full justify-start">
                         <MessageSquare className="h-4 w-4 mr-2" />
                         Send Mass Response
                       </Button>
                       <Button variant="outline" className="w-full justify-start">
                         <Download className="h-4 w-4 mr-2" />
                         Export Support Report
                       </Button>
                       <Button variant="outline" className="w-full justify-start">
                         <Settings className="h-4 w-4 mr-2" />
                         Configure Auto-Responses
                       </Button>
                       <Button variant="outline" className="w-full justify-start">
                         <Users className="h-4 w-4 mr-2" />
                         Assign to Staff
                       </Button>
                     </CardContent>
                   </Card>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>

           {/* Reviews & Feedback Tab */}
           <TabsContent value="reviews" className="space-y-6">
             <Card>
               <CardHeader>
                 <div className="flex justify-between items-center">
                   <div>
                     <CardTitle>Reviews & Feedback</CardTitle>
                     <CardDescription>Monitor customer reviews, ratings, and feedback collection</CardDescription>
                   </div>
                   <div className="flex space-x-2">
                     <Button variant="outline">
                       <Download className="h-4 w-4 mr-2" />
                       Export Reviews
                     </Button>
                     <Button>
                       <Plus className="h-4 w-4 mr-2" />
                       Request Feedback
                     </Button>
                   </div>
                 </div>
               </CardHeader>
               <CardContent>
                 <div className="space-y-6">
                                        {/* Review Statistics */}
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                       <Card>
                         <CardHeader className="pb-2">
                           <CardTitle className="text-sm font-medium">Overall Rating</CardTitle>
                         </CardHeader>
                         <CardContent>
                           <div className="flex items-center space-x-2">
                             <div className="text-2xl font-bold">{businessStats.averageRating}</div>
                             <div className="flex items-center">
                               <Star className="h-5 w-5 text-yellow-400 fill-current" />
                             </div>
                           </div>
                           <p className="text-xs text-muted-foreground">Based on {reviews.length} reviews</p>
                         </CardContent>
                       </Card>
                       <Card>
                         <CardHeader className="pb-2">
                           <CardTitle className="text-sm font-medium">This Month</CardTitle>
                         </CardHeader>
                         <CardContent>
                           <div className="text-2xl font-bold text-green-600">
                             {reviews.filter(r => new Date(r.created_at).getMonth() === new Date().getMonth()).length}
                           </div>
                           <p className="text-xs text-muted-foreground">New reviews</p>
                         </CardContent>
                       </Card>
                       <Card>
                         <CardHeader className="pb-2">
                           <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                         </CardHeader>
                         <CardContent>
                           <div className="text-2xl font-bold text-blue-600">{reviews.length}</div>
                           <p className="text-xs text-muted-foreground">All time</p>
                         </CardContent>
                       </Card>
                       <Card>
                         <CardHeader className="pb-2">
                           <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                         </CardHeader>
                         <CardContent>
                           <div className="text-2xl font-bold text-purple-600">
                             {reviews.filter(r => {
                               const reviewDate = new Date(r.created_at)
                               const now = new Date()
                               const diffTime = Math.abs(now.getTime() - reviewDate.getTime())
                               const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                               return diffDays <= 7
                             }).length}
                           </div>
                           <p className="text-xs text-muted-foreground">Last 7 days</p>
                         </CardContent>
                       </Card>
                     </div>

                                        {/* Recent Reviews */}
                     <Card>
                       <CardHeader>
                         <CardTitle>Recent Customer Reviews</CardTitle>
                         <CardDescription>Latest customer feedback and ratings</CardDescription>
                       </CardHeader>
                       <CardContent>
                         <div className="space-y-4">
                           {reviews.slice(0, 5).map((review, index) => (
                             <div key={review.id || index} className="flex items-start space-x-4 p-4 border rounded-lg">
                               <div className="flex-shrink-0">
                                 <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                   <Users className="h-6 w-6 text-primary" />
                                 </div>
                               </div>
                               <div className="flex-1">
                                 <div className="flex items-center justify-between">
                                   <h4 className="font-medium">{review.title || 'No Title'}</h4>
                                   <div className="flex items-center space-x-1">
                                     {[...Array(5)].map((_, i) => (
                                       <Star 
                                         key={i} 
                                         className={`h-4 w-4 ${
                                           i < (review.rating || 0) 
                                             ? 'text-yellow-400 fill-current' 
                                             : 'text-gray-300'
                                         }`} 
                                       />
                                     ))}
                                   </div>
                                 </div>
                                 <p className="text-sm text-muted-foreground">
                                   {review.customer_name || 'Anonymous'} - {review.service_name || 'Service'}
                                 </p>
                                 <p className="text-sm mt-2">
                                   {review.comment || 'No comment provided'}
                                 </p>
                                 <div className="flex items-center space-x-2 mt-3">
                                   <Button variant="outline" size="sm">
                                     <MessageSquare className="h-4 w-4 mr-2" />
                                     Reply
                                   </Button>
                                   <Button variant="outline" size="sm">
                                     <CheckCircle className="h-4 w-4 mr-2" />
                                     Mark as Responded
                                   </Button>
                                 </div>
                               </div>
                               <div className="text-right text-sm text-muted-foreground">
                                 <p>{new Date(review.created_at).toLocaleDateString()}</p>
                                 <p>{new Date(review.created_at).toLocaleTimeString()}</p>
                               </div>
                             </div>
                           ))}
                           {reviews.length === 0 && (
                             <div className="text-center py-8 text-muted-foreground">
                               No reviews found yet
                             </div>
                           )}
                         </div>
                       </CardContent>
                     </Card>

                   {/* Automated Feedback Collection */}
                   <Card>
                     <CardHeader>
                       <CardTitle>Automated Feedback Collection</CardTitle>
                       <CardDescription>Configure automated review requests and feedback collection</CardDescription>
                     </CardHeader>
                     <CardContent>
                       <div className="space-y-4">
                         <div className="flex items-center justify-between p-3 border rounded-lg">
                           <div>
                             <p className="font-medium">Post-Service Review Request</p>
                             <p className="text-sm text-muted-foreground">Send review request 24 hours after service completion</p>
                           </div>
                           <div className="flex items-center space-x-2">
                             <Badge className="bg-green-100 text-green-800">Active</Badge>
                             <Button variant="outline" size="sm">
                               <Edit className="h-4 w-4 mr-2" />
                               Edit
                             </Button>
                           </div>
                         </div>
                         
                         <div className="flex items-center justify-between p-3 border rounded-lg">
                           <div>
                             <p className="font-medium">Monthly Feedback Survey</p>
                             <p className="text-sm text-muted-foreground">Send comprehensive feedback survey on the 1st of each month</p>
                           </div>
                           <div className="flex items-center space-x-2">
                             <Badge className="bg-green-100 text-green-800">Active</Badge>
                             <Button variant="outline" size="sm">
                               <Edit className="h-4 w-4 mr-2" />
                               Edit
                             </Button>
                           </div>
                         </div>
                         
                         <div className="flex items-center justify-between p-3 border rounded-lg">
                           <div>
                             <p className="font-medium">Cancellation Feedback</p>
                             <p className="text-sm text-muted-foreground">Request feedback when customers cancel appointments</p>
                           </div>
                           <div className="flex items-center space-x-2">
                             <Badge className="bg-yellow-100 text-yellow-800">Inactive</Badge>
                             <Button variant="outline" size="sm">
                               <Edit className="h-4 w-4 mr-2" />
                               Edit
                             </Button>
                           </div>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>

           {/* Analytics Tab */}
           <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Monthly revenue performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <BarChart3 className="h-16 w-16" />
                    <p>Revenue chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Distribution</CardTitle>
                  <CardDescription>Bookings by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <PieChart className="h-16 w-16" />
                    <p>Booking distribution chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Settings</CardTitle>
                <CardDescription>Configure your business preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Business Profile</p>
                    <p className="text-sm text-muted-foreground">Update your business information</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Operating Hours</p>
                    <p className="text-sm text-muted-foreground">Set your business hours</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-sm text-muted-foreground">Configure email and SMS alerts</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}