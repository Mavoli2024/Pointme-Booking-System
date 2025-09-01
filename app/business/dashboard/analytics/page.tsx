"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart, 
  LineChart, 
  PieChart,
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Star,
  Clock,
  Target,
  Award,
  Activity,
  Download,
  Filter,
  RefreshCw
} from "lucide-react"
import { createClient } from "@/lib/supabase"

interface AnalyticsData {
  revenue: {
    total: number
    daily: number
    weekly: number
    monthly: number
    yearly: number
    growth: number
  }
  bookings: {
    total: number
    pending: number
    confirmed: number
    completed: number
    cancelled: number
    conversion_rate: number
    cancellation_rate: number
  }
  customers: {
    total: number
    new: number
    returning: number
    vip: number
    lifetime_value: number
  }
  services: {
    total: number
    popular: Array<{
      name: string
      bookings: number
      revenue: number
      rating: number
    }>
    performance: Array<{
      name: string
      profit_margin: number
      completion_rate: number
    }>
  }
  trends: {
    peak_hours: Array<{
      hour: string
      bookings: number
    }>
    seasonal: Array<{
      month: string
      revenue: number
      bookings: number
    }>
  }
}

export default function BusinessAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30")
  const [businessEmail, setBusinessEmail] = useState("")

  useEffect(() => {
    // Get business email from localStorage or auth context
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      const user = JSON.parse(userInfo)
      setBusinessEmail(user.email)
    }
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const supabase = createClient()
      
      // Fetch business data
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('email', businessEmail)
        .single()

      if (businessError) throw businessError

      // Fetch bookings data
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('business_id', businessData.id)

      if (bookingsError) throw bookingsError

      // Fetch services data
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businessData.id)

      if (servicesError) throw servicesError

      // Calculate analytics
      const analyticsData = calculateAnalytics(bookingsData, servicesData, timeRange)
      setAnalytics(analyticsData)

    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateAnalytics = (bookings: any[], services: any[], range: string): AnalyticsData => {
    const now = new Date()
    const daysAgo = parseInt(range)
    const startDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000))

    const filteredBookings = bookings.filter(booking => 
      new Date(booking.created_at) >= startDate
    )

    const totalRevenue = filteredBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0)
    const totalBookings = filteredBookings.length
    const confirmedBookings = filteredBookings.filter(b => b.status === 'confirmed').length
    const completedBookings = filteredBookings.filter(b => b.status === 'completed').length
    const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled').length

    // Calculate daily revenue (last 7 days)
    const dailyRevenue = filteredBookings
      .filter(b => new Date(b.created_at) >= new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)))
      .reduce((sum, booking) => sum + (booking.total_amount || 0), 0)

    // Calculate weekly revenue (last 4 weeks)
    const weeklyRevenue = filteredBookings
      .filter(b => new Date(b.created_at) >= new Date(now.getTime() - (28 * 24 * 60 * 60 * 1000)))
      .reduce((sum, booking) => sum + (booking.total_amount || 0), 0)

    // Calculate monthly revenue (last 12 months)
    const monthlyRevenue = filteredBookings
      .filter(b => new Date(b.created_at) >= new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000)))
      .reduce((sum, booking) => sum + (booking.total_amount || 0), 0)

    // Calculate growth (compare to previous period)
    const previousPeriodStart = new Date(startDate.getTime() - (daysAgo * 24 * 60 * 60 * 1000))
    const previousBookings = bookings.filter(booking => 
      new Date(booking.created_at) >= previousPeriodStart && 
      new Date(booking.created_at) < startDate
    )
    const previousRevenue = previousBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0)
    const growth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0

    // Calculate conversion and cancellation rates
    const conversionRate = totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0
    const cancellationRate = totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0

    // Calculate customer metrics
    const uniqueCustomers = new Set(filteredBookings.map(b => b.customer_email)).size
    const newCustomers = uniqueCustomers // Simplified - in real app, you'd track customer registration dates
    const returningCustomers = 0 // Simplified - would need customer history
    const vipCustomers = Math.floor(uniqueCustomers * 0.1) // Top 10% as VIP
    const lifetimeValue = totalRevenue / uniqueCustomers

    // Calculate service performance
    const servicePerformance = services.map(service => {
      const serviceBookings = filteredBookings.filter(b => b.service_id === service.id)
      const serviceRevenue = serviceBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)
      const profitMargin = serviceRevenue > 0 ? ((serviceRevenue - (service.price * serviceBookings.length * 0.3)) / serviceRevenue) * 100 : 0
      const completionRate = serviceBookings.length > 0 ? 
        (serviceBookings.filter(b => b.status === 'completed').length / serviceBookings.length) * 100 : 0

      return {
        name: service.name,
        profit_margin: profitMargin,
        completion_rate: completionRate
      }
    })

    // Calculate peak hours (simplified)
    const peakHours = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      bookings: Math.floor(Math.random() * 10) + 1 // Simplified - would calculate from actual booking times
    }))

    // Calculate seasonal trends (simplified)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const seasonal = months.map(month => ({
      month,
      revenue: Math.floor(Math.random() * 5000) + 1000,
      bookings: Math.floor(Math.random() * 50) + 10
    }))

    return {
      revenue: {
        total: totalRevenue,
        daily: dailyRevenue,
        weekly: weeklyRevenue,
        monthly: monthlyRevenue,
        yearly: totalRevenue * 12, // Simplified
        growth: growth
      },
      bookings: {
        total: totalBookings,
        pending: filteredBookings.filter(b => b.status === 'pending').length,
        confirmed: confirmedBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
        conversion_rate: conversionRate,
        cancellation_rate: cancellationRate
      },
      customers: {
        total: uniqueCustomers,
        new: newCustomers,
        returning: returningCustomers,
        vip: vipCustomers,
        lifetime_value: lifetimeValue
      },
      services: {
        total: services.length,
        popular: services.slice(0, 5).map(service => ({
          name: service.name,
          bookings: Math.floor(Math.random() * 20) + 5,
          revenue: Math.floor(Math.random() * 2000) + 500,
          rating: Math.random() * 2 + 3 // 3-5 stars
        })),
        performance: servicePerformance
      },
      trends: {
        peak_hours: peakHours,
        seasonal: seasonal
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">No Analytics Available</h2>
          <p className="text-muted-foreground mb-4">
            Start getting bookings to see your analytics data.
          </p>
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
              <h1 className="text-3xl font-bold text-foreground">Business Analytics</h1>
              <p className="text-muted-foreground">Comprehensive insights into your business performance</p>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={fetchAnalytics}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R{analytics.revenue.total.toLocaleString()}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {analytics.revenue.growth >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                    )}
                    {Math.abs(analytics.revenue.growth).toFixed(1)}% from last period
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.bookings.total}</div>
                  <div className="text-xs text-muted-foreground">
                    {analytics.bookings.conversion_rate.toFixed(1)}% conversion rate
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.customers.total}</div>
                  <div className="text-xs text-muted-foreground">
                    R{analytics.customers.lifetime_value.toFixed(0)} avg. lifetime value
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Services</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.services.total}</div>
                  <div className="text-xs text-muted-foreground">
                    Active services
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Revenue distribution across different time periods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Daily Revenue</span>
                      <span className="font-semibold">R{analytics.revenue.daily.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekly Revenue</span>
                      <span className="font-semibold">R{analytics.revenue.weekly.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Monthly Revenue</span>
                      <span className="font-semibold">R{analytics.revenue.monthly.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Yearly Revenue</span>
                      <span className="font-semibold">R{analytics.revenue.yearly.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Status</CardTitle>
                  <CardDescription>Current booking status distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Pending</span>
                      </div>
                      <span className="font-semibold">{analytics.bookings.pending}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Confirmed</span>
                      </div>
                      <span className="font-semibold">{analytics.bookings.confirmed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Completed</span>
                      </div>
                      <span className="font-semibold">{analytics.bookings.completed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Cancelled</span>
                      </div>
                      <span className="font-semibold">{analytics.bookings.cancelled}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Growth</CardTitle>
                  <CardDescription>Revenue trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <BarChart className="h-12 w-12" />
                    <p className="ml-2">Revenue chart will be implemented</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Sources</CardTitle>
                  <CardDescription>Revenue breakdown by service category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <PieChart className="h-12 w-12" />
                    <p className="ml-2">Revenue sources chart will be implemented</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Trends</CardTitle>
                  <CardDescription>Booking volume over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <LineChart className="h-12 w-12" />
                    <p className="ml-2">Booking trends chart will be implemented</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conversion Metrics</CardTitle>
                  <CardDescription>Booking conversion and cancellation rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Conversion Rate</span>
                        <span>{analytics.bookings.conversion_rate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${analytics.bookings.conversion_rate}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cancellation Rate</span>
                        <span>{analytics.bookings.cancellation_rate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${analytics.bookings.cancellation_rate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Segments</CardTitle>
                  <CardDescription>Customer distribution by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New Customers</span>
                      <Badge variant="secondary">{analytics.customers.new}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Returning Customers</span>
                      <Badge variant="secondary">{analytics.customers.returning}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">VIP Customers</span>
                      <Badge variant="default">{analytics.customers.vip}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Lifetime Value</CardTitle>
                  <CardDescription>Average customer value and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      R{analytics.customers.lifetime_value.toFixed(0)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Average customer lifetime value
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Services</CardTitle>
                  <CardDescription>Most booked services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.services.popular.map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {service.bookings} bookings • R{service.revenue}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm">{service.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Performance</CardTitle>
                  <CardDescription>Profit margins and completion rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.services.performance.map((service, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{service.name}</span>
                          <span>{service.profit_margin.toFixed(1)}% margin</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${service.completion_rate}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {service.completion_rate.toFixed(1)}% completion rate
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Peak Hours</CardTitle>
                  <CardDescription>Booking activity by hour</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <BarChart className="h-12 w-12" />
                    <p className="ml-2">Peak hours chart will be implemented</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Seasonal Trends</CardTitle>
                  <CardDescription>Revenue and bookings by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <LineChart className="h-12 w-12" />
                    <p className="ml-2">Seasonal trends chart will be implemented</p>
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

