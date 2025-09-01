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
  AlertTriangle
} from "lucide-react"
import { createClient } from "@/lib/supabase"

export default function BusinessDashboard() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

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
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+5 pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R12,450</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">+3 new this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">Based on 24 reviews</p>
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
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-muted-foreground">Today at 2:00 PM</p>
                        <p className="text-sm text-muted-foreground">Hair Styling</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                        <p className="text-sm font-medium mt-1">R500</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">Jane Smith</p>
                        <p className="text-sm text-muted-foreground">Tomorrow at 10:00 AM</p>
                        <p className="text-sm text-muted-foreground">Nail Art</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>
                        <p className="text-sm font-medium mt-1">R300</p>
                      </div>
                    </div>
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
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">John Doe</p>
                          <p className="text-sm text-muted-foreground">john@example.com</p>
                          <p className="text-sm text-muted-foreground">+27123456789</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Today</p>
                          <p>2:00 PM</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      <p className="font-medium">R500</p>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
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
                   <Card>
                     <CardHeader>
                       <div className="flex justify-between items-start">
                         <div>
                           <CardTitle className="text-lg">Hair Styling</CardTitle>
                           <CardDescription>Professional hair styling services</CardDescription>
                         </div>
                         <Badge variant="default">Active</Badge>
                       </div>
                     </CardHeader>
                     <CardContent>
                       <div className="space-y-2">
                         <div className="flex justify-between text-sm">
                           <span>Price:</span>
                           <span className="font-medium">R500</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span>Duration:</span>
                           <span className="font-medium">60 min</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span>Assigned Staff:</span>
                           <span className="font-medium">Sarah, Mike</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span>Bookings:</span>
                           <span className="font-medium">12</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span>Revenue:</span>
                           <span className="font-medium">R6,000</span>
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
                     <Card>
                       <CardHeader className="pb-3">
                         <div className="flex items-center space-x-3">
                           <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                             <Users className="h-6 w-6 text-primary" />
                           </div>
                           <div>
                             <CardTitle className="text-lg">Sarah Johnson</CardTitle>
                             <CardDescription>Senior Hair Stylist</CardDescription>
                           </div>
                         </div>
                       </CardHeader>
                       <CardContent className="space-y-3">
                         <div className="flex justify-between text-sm">
                           <span>Status:</span>
                           <Badge className="bg-green-100 text-green-800">Active</Badge>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span>Services:</span>
                           <span className="font-medium">Hair Styling, Coloring</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span>Hours:</span>
                           <span className="font-medium">Mon-Fri, 9AM-6PM</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span>Rating:</span>
                           <div className="flex items-center">
                             <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                             <span className="font-medium">4.9</span>
                           </div>
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

                     <Card>
                       <CardHeader className="pb-3">
                         <div className="flex items-center space-x-3">
                           <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                             <Users className="h-6 w-6 text-primary" />
                           </div>
                           <div>
                             <CardTitle className="text-lg">Mike Chen</CardTitle>
                             <CardDescription>Nail Technician</CardDescription>
                           </div>
                         </div>
                       </CardHeader>
                       <CardContent className="space-y-3">
                         <div className="flex justify-between text-sm">
                           <span>Status:</span>
                           <Badge className="bg-green-100 text-green-800">Active</Badge>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span>Services:</span>
                           <span className="font-medium">Nail Art, Manicure</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span>Hours:</span>
                           <span className="font-medium">Mon-Sat, 10AM-7PM</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span>Rating:</span>
                           <div className="flex items-center">
                             <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                             <span className="font-medium">4.7</span>
                           </div>
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

                     <Card>
                       <CardHeader className="pb-3">
                         <div className="flex items-center space-x-3">
                           <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                             <Users className="h-6 w-6 text-primary" />
                           </div>
                           <div>
                             <CardTitle className="text-lg">Lisa Rodriguez</CardTitle>
                             <CardDescription>Receptionist</CardDescription>
                           </div>
                         </div>
                       </CardHeader>
                       <CardContent className="space-y-3">
                         <div className="flex justify-between text-sm">
                           <span>Status:</span>
                           <Badge className="bg-yellow-100 text-yellow-800">Part-time</Badge>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span>Services:</span>
                           <span className="font-medium">Customer Service</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span>Hours:</span>
                           <span className="font-medium">Mon-Fri, 2PM-6PM</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span>Rating:</span>
                           <div className="flex items-center">
                             <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                             <span className="font-medium">4.8</span>
                           </div>
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
                           <div className="text-2xl font-bold text-primary">3</div>
                           <div className="text-sm text-muted-foreground">Total Staff</div>
                         </div>
                         <div className="text-center">
                           <div className="text-2xl font-bold text-green-600">2</div>
                           <div className="text-sm text-muted-foreground">Full-time</div>
                         </div>
                         <div className="text-center">
                           <div className="text-2xl font-bold text-yellow-600">1</div>
                           <div className="text-sm text-muted-foreground">Part-time</div>
                         </div>
                         <div className="text-center">
                           <div className="text-2xl font-bold text-blue-600">4.8</div>
                           <div className="text-sm text-muted-foreground">Avg Rating</div>
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
                         <div className="text-2xl font-bold text-orange-600">8</div>
                         <p className="text-xs text-muted-foreground">Requires attention</p>
                       </CardContent>
                     </Card>
                     <Card>
                       <CardHeader className="pb-2">
                         <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                       </CardHeader>
                       <CardContent>
                         <div className="text-2xl font-bold text-blue-600">5</div>
                         <p className="text-xs text-muted-foreground">Being handled</p>
                       </CardContent>
                     </Card>
                     <Card>
                       <CardHeader className="pb-2">
                         <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                       </CardHeader>
                       <CardContent>
                         <div className="text-2xl font-bold text-green-600">23</div>
                         <p className="text-xs text-muted-foreground">This month</p>
                       </CardContent>
                     </Card>
                     <Card>
                       <CardHeader className="pb-2">
                         <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
                       </CardHeader>
                       <CardContent>
                         <div className="text-2xl font-bold text-purple-600">2.4h</div>
                         <p className="text-xs text-muted-foreground">Response time</p>
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
                         <div className="flex items-center justify-between p-4 border rounded-lg">
                           <div className="flex-1">
                             <div className="flex items-center space-x-3">
                               <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                               <Badge className="bg-orange-100 text-orange-800">Open</Badge>
                             </div>
                             <h4 className="font-medium mt-2">Service Quality Complaint</h4>
                             <p className="text-sm text-muted-foreground">Customer: John Smith</p>
                             <p className="text-sm text-muted-foreground">Service: Hair Styling on Dec 10</p>
                             <p className="text-sm text-muted-foreground mt-1">
                               "The service was not up to the expected standard. Hair color is different from what was discussed."
                             </p>
                           </div>
                           <div className="text-right">
                             <p className="text-sm text-muted-foreground">Dec 12, 2024</p>
                             <p className="text-sm text-muted-foreground">2 hours ago</p>
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

                         <div className="flex items-center justify-between p-4 border rounded-lg">
                           <div className="flex-1">
                             <div className="flex items-center space-x-3">
                               <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>
                               <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                             </div>
                             <h4 className="font-medium mt-2">Booking Cancellation Request</h4>
                             <p className="text-sm text-muted-foreground">Customer: Sarah Johnson</p>
                             <p className="text-sm text-muted-foreground">Service: Nail Art on Dec 15</p>
                             <p className="text-sm text-muted-foreground mt-1">
                               "Need to cancel my appointment due to an emergency. Can I reschedule?"
                             </p>
                           </div>
                           <div className="text-right">
                             <p className="text-sm text-muted-foreground">Dec 11, 2024</p>
                             <p className="text-sm text-muted-foreground">1 day ago</p>
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

                         <div className="flex items-center justify-between p-4 border rounded-lg">
                           <div className="flex-1">
                             <div className="flex items-center space-x-3">
                               <Badge className="bg-blue-100 text-blue-800">Low Priority</Badge>
                               <Badge className="bg-orange-100 text-orange-800">Open</Badge>
                             </div>
                             <h4 className="font-medium mt-2">General Inquiry</h4>
                             <p className="text-sm text-muted-foreground">Customer: Mike Davis</p>
                             <p className="text-sm text-muted-foreground">Service: Information Request</p>
                             <p className="text-sm text-muted-foreground mt-1">
                               "What are your operating hours during the holiday season?"
                             </p>
                           </div>
                           <div className="text-right">
                             <p className="text-sm text-muted-foreground">Dec 11, 2024</p>
                             <p className="text-sm text-muted-foreground">1 day ago</p>
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
                           <div className="text-2xl font-bold">4.8</div>
                           <div className="flex items-center">
                             <Star className="h-5 w-5 text-yellow-400 fill-current" />
                           </div>
                         </div>
                         <p className="text-xs text-muted-foreground">Based on 156 reviews</p>
                       </divContent>
                     </Card>
                     <Card>
                       <CardHeader className="pb-2">
                         <CardTitle className="text-sm font-medium">This Month</CardTitle>
                       </CardHeader>
                       <CardContent>
                         <div className="text-2xl font-bold text-green-600">24</div>
                         <p className="text-xs text-muted-foreground">New reviews</p>
                       </divContent>
                     </Card>
                     <Card>
                       <CardHeader className="pb-2">
                         <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                       </CardHeader>
                       <CardContent>
                         <div className="text-2xl font-bold text-blue-600">89%</div>
                         <p className="text-xs text-muted-foreground">Reviews responded to</p>
                       </divContent>
                     </Card>
                     <Card>
                       <CardHeader className="pb-2">
                         <CardTitle className="text-sm font-medium">Feedback Requests</CardTitle>
                       </CardHeader>
                       <CardContent>
                         <div className="text-2xl font-bold text-purple-600">67</div>
                         <p className="text-xs text-muted-foreground">Sent this month</p>
                       </divContent>
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
                         <div className="flex items-start space-x-4 p-4 border rounded-lg">
                           <div className="flex-shrink-0">
                             <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                               <Users className="h-6 w-6 text-primary" />
                             </div>
                           </div>
                           <div className="flex-1">
                             <div className="flex items-center justify-between">
                               <h4 className="font-medium">Excellent Service!</h4>
                               <div className="flex items-center space-x-1">
                                 <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                 <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                 <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                 <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                 <Star className="h-4 w-4 text-yellow-400 fill-current" />
                               </div>
                             </div>
                             <p className="text-sm text-muted-foreground">Sarah Johnson - Hair Styling</p>
                             <p className="text-sm mt-2">
                               "Amazing experience! The stylist was professional and the result exceeded my expectations. 
                               Will definitely come back and recommend to friends."
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
                             <p>Dec 12, 2024</p>
                             <p>2 hours ago</p>
                           </div>
                         </div>

                         <div className="flex items-start space-x-4 p-4 border rounded-lg">
                           <div className="flex-shrink-0">
                             <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                               <Users className="h-6 w-6 text-primary" />
                             </div>
                           </div>
                           <div className="flex-1">
                             <div className="flex items-center justify-between">
                               <h4 className="font-medium">Good but could be better</h4>
                               <div className="flex items-center space-x-1">
                                 <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                 <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                 <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                 <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                 <Star className="h-4 w-4 text-gray-300" />
                               </div>
                             </div>
                             <p className="text-sm text-muted-foreground">Mike Chen - Nail Art</p>
                             <p className="text-sm mt-2">
                               "The service was good overall, but the waiting time was longer than expected. 
                               The nail art design was beautiful though."
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
                             <p>Dec 11, 2024</p>
                             <p>1 day ago</p>
                           </div>
                         </div>
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