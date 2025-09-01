import { createClient } from "@/lib/supabase"

// Enhanced Type Definitions
export interface AdminStats {
  totalUsers: number
  totalBusinesses: number
  totalBookings: number
  totalRevenue: number
  newUsersThisMonth: number
  newBusinessesThisMonth: number
  bookingsThisMonth: number
  revenueThisMonth: number
  pendingApprovals: number
  activeUsers: number
  verifiedBusinesses: number
  completedBookings: number
  pendingPayouts: number
  failedPayments: number
  platformCommission: number
  systemHealth: {
    database: string
    apiResponse: string
    storage: string
    emailService: string
  }
}

export interface UserData {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  status: string
  verified: boolean
  created_at: string
  last_login?: string
  total_bookings: number
  total_spent: number
  preferences?: any
  activity_logs?: any[]
}

export interface BusinessData {
  id: string
  name: string
  email: string
  phone: string
  address: string
  category: string
  status: string
  verified: boolean
  created_at: string
  total_revenue: number
  total_bookings: number
  commission_rate: number
  rating: number
  review_count: number
  operating_hours?: any
  documents?: any[]
  services?: ServiceData[]
}

export interface ServiceData {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
  business_id: string
  business_name: string
  status: string
  created_at: string
  booking_count: number
  rating: number
  review_count: number
}

export interface BookingData {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  businessName: string
  serviceName: string
  bookingDate: string
  bookingTime: string
  status: string
  paymentStatus: string
  amount: number
  commission: number
  created_at: string
  specialRequests?: string
  notes?: string
  cancellationReason?: string
  noShow?: boolean
  lateArrival?: boolean
}

export interface FinancialData {
  id: string
  businessName: string
  businessId: string
  date: string
  revenue: number
  commission: number
  transactionCount: number
  refunds: number
  failedPayments: number
  pendingPayouts: number
  paymentMethod: string
  status: string
}

export interface CommunicationData {
  id: string
  type: string
  subject: string
  recipient: string
  status: string
  sent_at: string
  opened_at?: string
  clicked_at?: string
  template?: string
  content?: string
}

export interface AnalyticsData {
  userGrowth: {
    total: number
    newThisMonth: number
    growthRate: number
    trend: 'up' | 'down' | 'stable'
  }
  revenueTrends: {
    total: number
    thisMonth: number
    growthRate: number
    averagePerBooking: number
    monthlyData: Array<{
      month: string
      revenue: number
      bookings: number
    }>
  }
  bookingAnalytics: {
    total: number
    thisMonth: number
    conversionRate: number
    cancellationRate: number
    averageValue: number
    peakHours: Array<{
      hour: string
      bookings: number
    }>
  }
  businessPerformance: {
    totalBusinesses: number
    activeBusinesses: number
    averageRating: number
    topCategories: Array<{
      category: string
      count: number
      revenue: number
    }>
  }
}

export interface SystemSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  autoApproveBusinesses: boolean
  maintenanceMode: boolean
  platformCommission: number
  minBookingAmount: number
  maxBookingAmount: number
  defaultCommissionRate: number
  supportEmail: string
  supportPhone: string
}

// Enhanced Data Fetching Functions
export async function getAdminStats(): Promise<AdminStats> {
  try {
    const supabase = createClient()
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Fetch all data in parallel
    const [
      { count: totalUsers },
      { count: totalBusinesses },
      { count: totalBookings },
      { data: bookings },
      { data: businesses },
      { data: users }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('businesses').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('*'),
      supabase.from('businesses').select('*'),
      supabase.from('users').select('*')
    ])

    const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0
    const revenueThisMonth = bookings?.filter(booking => 
      new Date(booking.created_at) >= startOfMonth
    ).reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0

    const newUsersThisMonth = users?.filter(user => 
      new Date(user.created_at) >= startOfMonth
    ).length || 0

    const newBusinessesThisMonth = businesses?.filter(business => 
      new Date(business.created_at) >= startOfMonth
    ).length || 0

    const bookingsThisMonth = bookings?.filter(booking => 
      new Date(booking.created_at) >= startOfMonth
    ).length || 0

    const pendingApprovals = businesses?.filter(business => business.status === 'pending').length || 0
    const activeUsers = users?.filter(user => user.status === 'active').length || 0
    const verifiedBusinesses = businesses?.filter(business => business.verified).length || 0
    const completedBookings = bookings?.filter(booking => booking.status === 'completed').length || 0

    return {
      totalUsers: totalUsers || 0,
      totalBusinesses: totalBusinesses || 0,
      totalBookings: totalBookings || 0,
      totalRevenue,
      newUsersThisMonth,
      newBusinessesThisMonth,
      bookingsThisMonth,
      revenueThisMonth,
      pendingApprovals,
      activeUsers,
      verifiedBusinesses,
      completedBookings,
      pendingPayouts: 0, // TODO: Implement payout tracking
      failedPayments: 0, // TODO: Implement failed payment tracking
      platformCommission: 10, // Default commission rate
      systemHealth: {
        database: 'Healthy',
        apiResponse: 'Fast',
        storage: '75% Used',
        emailService: 'Active'
      }
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return {
      totalUsers: 0,
      totalBusinesses: 0,
      totalBookings: 0,
      totalRevenue: 0,
      newUsersThisMonth: 0,
      newBusinessesThisMonth: 0,
      bookingsThisMonth: 0,
      revenueThisMonth: 0,
      pendingApprovals: 0,
      activeUsers: 0,
      verifiedBusinesses: 0,
      completedBookings: 0,
      pendingPayouts: 0,
      failedPayments: 0,
      platformCommission: 10,
      systemHealth: {
        database: 'Unknown',
        apiResponse: 'Unknown',
        storage: 'Unknown',
        emailService: 'Unknown'
      }
    }
  }
}

export async function getUsers(): Promise<UserData[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        phone,
        role,
        status,
        verified,
        created_at,
        last_login
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Enhance with booking data
    const enhancedUsers = await Promise.all(
      (data || []).map(async (user) => {
        const { data: userBookings } = await supabase
          .from('bookings')
          .select('total_amount')
          .eq('customer_email', user.email)

        const totalBookings = userBookings?.length || 0
        const totalSpent = userBookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0

        return {
          ...user,
          total_bookings: totalBookings,
          total_spent: totalSpent,
          preferences: {},
          activity_logs: []
        }
      })
    )

    return enhancedUsers
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export async function getBusinesses(): Promise<BusinessData[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        id,
        name,
        email,
        phone,
        address,
        category_id,
        status,
        verified,
        created_at,
        commission_rate,
        rating,
        review_count,
        service_categories!inner(name)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Enhance with revenue and booking data
    const enhancedBusinesses = await Promise.all(
      (data || []).map(async (business) => {
        const { data: businessBookings } = await supabase
          .from('bookings')
          .select('total_amount')
          .eq('business_id', business.id)

        const totalBookings = businessBookings?.length || 0
        const totalRevenue = businessBookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0

                 return {
           ...business,
           category: (business.service_categories as any)?.name || 'Unknown',
           total_revenue: totalRevenue,
           total_bookings: totalBookings,
           operating_hours: {},
           documents: [],
           services: []
         }
      })
    )

    return enhancedBusinesses
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return []
  }
}

export async function getServices(): Promise<ServiceData[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('services')
      .select(`
        id,
        name,
        description,
        price,
        duration,
        category_id,
        business_id,
        status,
        created_at,
        rating,
        review_count,
        businesses!inner(name),
        service_categories!inner(name)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Enhance with booking data
    const enhancedServices = await Promise.all(
      (data || []).map(async (service) => {
        const { data: serviceBookings } = await supabase
          .from('bookings')
          .select('id')
          .eq('service_id', service.id)

                 return {
           ...service,
           business_name: (service.businesses as any)?.name || 'Unknown',
           category: (service.service_categories as any)?.name || 'Unknown',
           booking_count: serviceBookings?.length || 0
         }
      })
    )

    return enhancedServices
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}

export async function getBookings(): Promise<BookingData[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        customer_name,
        customer_email,
        customer_phone,
        booking_date,
        booking_time,
        status,
        payment_status,
        total_amount,
        special_requests,
        notes,
        cancellation_reason,
        no_show,
        late_arrival,
        created_at,
        businesses!inner(name),
        services!inner(name)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

         return (data || []).map(booking => ({
       id: booking.id,
       customerName: booking.customer_name,
       customerEmail: booking.customer_email,
       customerPhone: booking.customer_phone,
       businessName: (booking.businesses as any)?.name || 'Unknown',
       serviceName: (booking.services as any)?.name || 'Unknown',
       bookingDate: booking.booking_date,
       bookingTime: booking.booking_time,
       status: booking.status,
       paymentStatus: booking.payment_status,
       amount: booking.total_amount,
       commission: (booking.total_amount * 0.1), // 10% commission
       created_at: booking.created_at,
       specialRequests: booking.special_requests,
       notes: booking.notes,
       cancellationReason: booking.cancellation_reason,
       noShow: booking.no_show,
       lateArrival: booking.late_arrival
     }))
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return []
  }
}

export async function getFinancialData(): Promise<FinancialData[]> {
  try {
    const supabase = createClient()
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        total_amount,
        payment_status,
        created_at,
        businesses!inner(name, id)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Group by business and date
    const financialMap = new Map<string, FinancialData>()
    
    bookings?.forEach(booking => {
      const businessId = booking.businesses?.id || 'unknown'
      const businessName = booking.businesses?.name || 'Unknown'
      const date = new Date(booking.created_at).toISOString().split('T')[0]
      const key = `${businessId}-${date}`

      if (!financialMap.has(key)) {
        financialMap.set(key, {
          id: key,
          businessName,
          businessId,
          date,
          revenue: 0,
          commission: 0,
          transactionCount: 0,
          refunds: 0,
          failedPayments: 0,
          pendingPayouts: 0,
          paymentMethod: 'online',
          status: 'completed'
        })
      }

      const financial = financialMap.get(key)!
      financial.revenue += booking.total_amount || 0
      financial.commission += (booking.total_amount || 0) * 0.1 // 10% commission
      financial.transactionCount += 1

      if (booking.payment_status === 'failed') {
        financial.failedPayments += booking.total_amount || 0
      }
    })

    return Array.from(financialMap.values())
  } catch (error) {
    console.error('Error fetching financial data:', error)
    return []
  }
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    const supabase = createClient()
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    // Fetch data for analytics
    const [
      { data: users },
      { data: bookings },
      { data: businesses }
    ] = await Promise.all([
      supabase.from('users').select('created_at'),
      supabase.from('bookings').select('created_at, total_amount, booking_time'),
      supabase.from('businesses').select('created_at, category_id, rating')
    ])

    // Calculate user growth
    const newUsersThisMonth = users?.filter(user => 
      new Date(user.created_at) >= startOfMonth
    ).length || 0

    const newUsersLastMonth = users?.filter(user => 
      new Date(user.created_at) >= lastMonth && new Date(user.created_at) < startOfMonth
    ).length || 0

    const userGrowthRate = newUsersLastMonth > 0 
      ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100 
      : 0

    // Calculate revenue trends
    const monthlyRevenue = bookings?.filter(booking => 
      new Date(booking.created_at) >= startOfMonth
    ).reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0

    const lastMonthRevenue = bookings?.filter(booking => 
      new Date(booking.created_at) >= lastMonth && new Date(booking.created_at) < startOfMonth
    ).reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0

    const revenueGrowthRate = lastMonthRevenue > 0 
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0

    // Calculate booking analytics
    const totalBookings = bookings?.length || 0
    const completedBookings = bookings?.filter(booking => booking.status === 'completed').length || 0
    const cancelledBookings = bookings?.filter(booking => booking.status === 'cancelled').length || 0

    const conversionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0
    const cancellationRate = totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0

    // Calculate peak hours
    const hourCounts = new Array(24).fill(0)
    bookings?.forEach(booking => {
      if (booking.booking_time) {
        const hour = parseInt(booking.booking_time.split(':')[0])
        hourCounts[hour]++
      }
    })

    const peakHours = hourCounts.map((count, hour) => ({
      hour: `${hour}:00`,
      bookings: count
    })).sort((a, b) => b.bookings - a.bookings).slice(0, 5)

    return {
      userGrowth: {
        total: users?.length || 0,
        newThisMonth: newUsersThisMonth,
        growthRate: userGrowthRate,
        trend: userGrowthRate > 0 ? 'up' : userGrowthRate < 0 ? 'down' : 'stable'
      },
      revenueTrends: {
        total: bookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0,
        thisMonth: monthlyRevenue,
        growthRate: revenueGrowthRate,
        averagePerBooking: totalBookings > 0 
          ? (bookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0) / totalBookings 
          : 0,
        monthlyData: [] // TODO: Implement monthly data aggregation
      },
      bookingAnalytics: {
        total: totalBookings,
        thisMonth: bookings?.filter(booking => 
          new Date(booking.created_at) >= startOfMonth
        ).length || 0,
        conversionRate,
        cancellationRate,
        averageValue: totalBookings > 0 
          ? (bookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0) / totalBookings 
          : 0,
        peakHours
      },
      businessPerformance: {
        totalBusinesses: businesses?.length || 0,
        activeBusinesses: businesses?.filter(business => business.status === 'approved').length || 0,
        averageRating: businesses?.reduce((sum, business) => sum + (business.rating || 0), 0) / (businesses?.length || 1),
        topCategories: [] // TODO: Implement category analysis
      }
    }
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return {
      userGrowth: { total: 0, newThisMonth: 0, growthRate: 0, trend: 'stable' },
      revenueTrends: { total: 0, thisMonth: 0, growthRate: 0, averagePerBooking: 0, monthlyData: [] },
      bookingAnalytics: { total: 0, thisMonth: 0, conversionRate: 0, cancellationRate: 0, averageValue: 0, peakHours: [] },
      businessPerformance: { totalBusinesses: 0, activeBusinesses: 0, averageRating: 0, topCategories: [] }
    }
  }
}

export async function getSystemSettings(): Promise<SystemSettings> {
  // TODO: Implement system settings from database
  return {
    emailNotifications: true,
    smsNotifications: false,
    autoApproveBusinesses: false,
    maintenanceMode: false,
    platformCommission: 10,
    minBookingAmount: 50,
    maxBookingAmount: 10000,
    defaultCommissionRate: 10,
    supportEmail: 'support@pointme.co.za',
    supportPhone: '+27 123 456 789'
  }
}

// Action Functions
export async function updateUserStatus(userId: string, status: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', userId)

    return !error
  } catch (error) {
    console.error('Error updating user status:', error)
    return false
  }
}

export async function updateBusinessStatus(businessId: string, status: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('businesses')
      .update({ status })
      .eq('id', businessId)

    return !error
  } catch (error) {
    console.error('Error updating business status:', error)
    return false
  }
}

export async function updateBookingStatus(bookingId: string, status: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)

    return !error
  } catch (error) {
    console.error('Error updating booking status:', error)
    return false
  }
}

export async function sendBulkEmail(recipients: string[], subject: string, content: string): Promise<boolean> {
  try {
    // TODO: Implement email sending logic
    console.log('Sending bulk email to:', recipients.length, 'recipients')
    return true
  } catch (error) {
    console.error('Error sending bulk email:', error)
    return false
  }
}

export async function exportData(type: string, filters?: any): Promise<string> {
  try {
    let data: any[] = []
    
    switch (type) {
      case 'users':
        data = await getUsers()
        break
      case 'businesses':
        data = await getBusinesses()
        break
      case 'bookings':
        data = await getBookings()
        break
      case 'financials':
        data = await getFinancialData()
        break
      default:
        throw new Error('Invalid export type')
    }

    // Convert to CSV
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(data[0] || {}).join(",") + "\n" +
      data.map(row => Object.values(row).join(",")).join("\n")
    
    return csvContent
  } catch (error) {
    console.error('Error exporting data:', error)
    throw error
  }
}
