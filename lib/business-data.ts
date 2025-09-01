import { createClient } from '@/lib/supabase'

// Business Dashboard Data Interface
export interface BusinessDashboardData {
  id: string
  name: string
  email: string
  phone: string
  address: string
  status: string
  rating: number
  total_reviews: number
  created_at: string
  owner_name: string
  category_name: string
  total_revenue: number
  total_bookings: number
  completed_bookings: number
  pending_bookings: number
  cancelled_bookings: number
  average_booking_value: number
  commission_rate: number
  total_commission: number
  pending_payouts: number
}

// Business Booking Data Interface
export interface BusinessBookingData {
  id: string
  booking_date: string
  booking_time: string
  status: string
  total_amount: number
  payment_status: string
  payment_method: string
  customer_name: string
  customer_email: string
  customer_phone: string
  service_name: string
  service_price: number
  notes: string
  created_at: string
  review?: {
    rating: number
    comment: string
    created_at: string
  }
}

// Business Service Data Interface
export interface BusinessServiceData {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category_name: string
  status: string
  is_active: boolean
  total_bookings: number
  total_revenue: number
  average_rating: number
  created_at: string
}

// Business Financial Data Interface
export interface BusinessFinancialData {
  id: string
  date: string
  type: string
  amount: number
  description: string
  status: string
  booking_id?: string
  customer_name?: string
  service_name?: string
  total_revenue?: number
  total_commission?: number
  pending_payouts?: number
  failed_payments?: number
  monthly_trends?: Array<{
    month: string
    revenue: number
    commission: number
    bookings: number
  }>
}

// Business Review Data Interface
export interface BusinessReviewData {
  id: string
  customer_name: string
  customer_email: string
  rating: number
  comment: string
  service_name: string
  booking_date: string
  created_at: string
  response?: string
  response_date?: string
  is_verified?: boolean
}

// Business Stats Interface
export interface BusinessStats {
  totalRevenue: number
  totalBookings: number
  completedBookings: number
  pendingBookings: number
  cancelledBookings: number
  averageRating: number
  totalReviews: number
  totalServices: number
  activeServices: number
  totalCustomers: number
  repeatCustomers: number
  newCustomers: number
  conversionRate: number
  averageBookingValue: number
  totalCommission: number
  pendingPayouts: number
  upcomingBookings: number
  todayBookings: number
}

// Fetch business dashboard data
export async function getBusinessDashboardData(businessEmail: string): Promise<BusinessDashboardData | null> {
  const supabase = createClient()
  
  try {
    console.log('Fetching business dashboard data for:', businessEmail)
    
    // First get the business owner user ID from email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', businessEmail)
      .single()
    
    if (userError) {
      console.log('User not found or error:', userError)
      // Return default data if user not found
      return {
        id: 'default',
        name: 'Demo Business',
        email: businessEmail,
        phone: '+1234567890',
        address: '123 Demo Street',
        status: 'active',
        rating: 4.5,
        total_reviews: 0,
        created_at: new Date().toISOString(),
        owner_name: 'Demo Owner',
        category_name: 'General',
        total_revenue: 0,
        total_bookings: 0,
        completed_bookings: 0,
        pending_bookings: 0,
        cancelled_bookings: 0,
        average_booking_value: 0,
        commission_rate: 15,
        total_commission: 0,
        pending_payouts: 0
      }
    }
    
    if (!user) {
      console.log('No user found for email:', businessEmail)
      return null
    }

    // Get business data
    const { data: business, error } = await supabase
      .from('businesses')
      .select(`
        id,
        name,
        email,
        phone,
        address,
        status,
        rating,
        total_reviews,
        created_at,
        owner_id,
        category_id,
        owner:users!inner(name),
        category:service_categories!inner(name)
      `)
      .eq('owner_id', user.id)
      .single()
    
    if (error) {
      console.log('Business not found or error:', error)
      // Return default data if business not found
      return {
        id: 'default',
        name: 'Demo Business',
        email: businessEmail,
        phone: '+1234567890',
        address: '123 Demo Street',
        status: 'active',
        rating: 4.5,
        total_reviews: 0,
        created_at: new Date().toISOString(),
        owner_name: 'Demo Owner',
        category_name: 'General',
        total_revenue: 0,
        total_bookings: 0,
        completed_bookings: 0,
        pending_bookings: 0,
        cancelled_bookings: 0,
        average_booking_value: 0,
        commission_rate: 15,
        total_commission: 0,
        pending_payouts: 0
      }
    }
    
    if (!business) {
      console.log('No business found for user:', user.id)
      return null
    }

    // Get booking statistics
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('total_amount, status, commission_amount')
      .eq('business_id', business.id)
    
    if (bookingsError) {
      console.log('Error fetching bookings:', bookingsError)
    }

    // Get commission data
    const { data: commissions, error: commissionsError } = await supabase
      .from('commissions')
      .select('amount, status')
      .eq('business_id', business.id)
    
    if (commissionsError) {
      console.log('Error fetching commissions:', commissionsError)
    }

    // Calculate statistics
    const total_bookings = bookings?.length || 0
    const completed_bookings = bookings?.filter(b => b.status === 'completed').length || 0
    const pending_bookings = bookings?.filter(b => b.status === 'pending').length || 0
    const cancelled_bookings = bookings?.filter(b => b.status === 'cancelled').length || 0
    const total_revenue = bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0
    const average_booking_value = total_bookings > 0 ? total_revenue / total_bookings : 0
    
    const total_commission = commissions?.reduce((sum, c) => sum + (c.amount || 0), 0) || 0
    const pending_payouts = commissions?.filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + (c.amount || 0), 0) || 0

    return {
      id: business.id,
      name: business.name,
      email: business.email,
      phone: business.phone,
      address: business.address,
      status: business.status,
      rating: business.rating || 0,
      total_reviews: business.total_reviews || 0,
      created_at: business.created_at,
      owner_name: (business.owner as any)?.name || 'Unknown',
      category_name: (business.category as any)?.name || 'General',
      total_revenue,
      total_bookings,
      completed_bookings,
      pending_bookings,
      cancelled_bookings,
      average_booking_value,
      commission_rate: 15, // Default commission rate
      total_commission,
      pending_payouts
    }
  } catch (error) {
    console.error('Error fetching business dashboard data:', error)
    // Return default data on error
    return {
      id: 'default',
      name: 'Demo Business',
      email: businessEmail,
      phone: '+1234567890',
      address: '123 Demo Street',
      status: 'active',
      rating: 4.5,
      total_reviews: 0,
      created_at: new Date().toISOString(),
      owner_name: 'Demo Owner',
      category_name: 'General',
      total_revenue: 0,
      total_bookings: 0,
      completed_bookings: 0,
      pending_bookings: 0,
      cancelled_bookings: 0,
      average_booking_value: 0,
      commission_rate: 15,
      total_commission: 0,
      pending_payouts: 0
    }
  }
}

// Fetch business bookings
export async function getBusinessBookings(businessEmail: string): Promise<BusinessBookingData[]> {
  const supabase = createClient()
  
  try {
    // First get the business owner user ID from email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', businessEmail)
      .single()
    
    if (userError) throw userError
    if (!user) return []

    // Get business ID
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user.id)
      .single()
    
    if (businessError) throw businessError
    if (!business) return []

    // Get bookings with related data
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        booking_date,
        booking_time,
        status,
        total_amount,
        payment_status,
        notes,
        created_at,
        customer_id,
        service_id,
        customer:users!inner(name, email, phone),
        service:services!inner(name, price)
      `)
      .eq('business_id', business.id)
      .order('booking_date', { ascending: false })
    
    if (error) throw error

    // Get payment methods
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('booking_id, payment_method')
    
    if (paymentsError) throw paymentsError

    // Get reviews for completed bookings
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('booking_id, rating, comment, created_at')
    
    if (reviewsError) throw reviewsError

    return bookings?.map(booking => {
      const payment = payments?.find(p => p.booking_id === booking.id)
      const review = reviews?.find(r => r.booking_id === booking.id)
      
      return {
        id: booking.id,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        status: booking.status,
        total_amount: booking.total_amount,
        payment_status: booking.payment_status,
        payment_method: payment?.payment_method || 'unknown',
        customer_name: (booking.customer as any)?.name || 'Unknown',
        customer_email: (booking.customer as any)?.email || 'Unknown',
        customer_phone: (booking.customer as any)?.phone || 'Unknown',
        service_name: (booking.service as any)?.name || 'Unknown Service',
        service_price: (booking.service as any)?.price || 0,
        notes: booking.notes,
        created_at: booking.created_at,
        review: review ? {
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at
        } : undefined
      }
    }) || []
  } catch (error) {
    console.error('Error fetching business bookings:', error)
    return []
  }
}

// Fetch business services
export async function getBusinessServices(businessEmail: string): Promise<BusinessServiceData[]> {
  const supabase = createClient()
  
  try {
    // First get the business owner user ID from email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', businessEmail)
      .single()
    
    if (userError) throw userError
    if (!user) return []

    // Get business ID
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user.id)
      .single()
    
    if (businessError) throw businessError
    if (!business) return []

    // Get services with related data
    const { data: services, error } = await supabase
      .from('services')
      .select(`
        id,
        name,
        description,
        price,
        duration,
        status,
        created_at,
        category_id,
        category:service_categories!inner(name)
      `)
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error

    // Get booking statistics for each service
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('service_id, total_amount, status')
      .eq('business_id', business.id)
    
    if (bookingsError) throw bookingsError

    // Get reviews for each service
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('booking_id, rating')
      .eq('business_id', business.id)
    
    if (reviewsError) throw reviewsError

    return services?.map(service => {
      const serviceBookings = bookings?.filter(b => b.service_id === service.id) || []
      const serviceReviews = reviews?.filter(r => 
        serviceBookings.some((b: any) => b.id === r.booking_id)
      ) || []
      
      const total_bookings = serviceBookings.length
      const total_revenue = serviceBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)
      const average_rating = serviceReviews.length > 0 
        ? serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length 
        : 0
      
      return {
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        category_name: (service.category as any)?.name || 'General',
        status: service.status,
        is_active: service.status === 'active',
        total_bookings,
        total_revenue,
        average_rating,
        created_at: service.created_at
      }
    }) || []
  } catch (error) {
    console.error('Error fetching business services:', error)
    return []
  }
}

// Fetch business financial data
export async function getBusinessFinancialData(businessEmail: string): Promise<BusinessFinancialData | null> {
  const supabase = createClient()
  
  try {
    // First get the business owner user ID from email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', businessEmail)
      .single()
    
    if (userError) throw userError
    if (!user) return null

    // Get business ID
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user.id)
      .single()
    
    if (businessError) throw businessError
    if (!business) return null

    // Get payments with related data
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        id,
        amount,
        payment_method,
        status,
        created_at,
        booking_id,
        booking:bookings(
          customer_id,
          service_id,
          customer:users!inner(name),
          service:services!inner(name)
        )
      `)
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error

    // Calculate financial metrics
    const total_revenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
    const total_commission = payments?.reduce((sum, p) => sum + (p.amount || 0) * 0.15, 0) || 0 // 15% commission
    const pending_payouts = payments?.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0) || 0
    const failed_payments = payments?.filter(p => p.status === 'failed').length || 0

    // Generate monthly trends (last 6 months)
    const monthly_trends = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      
      const monthPayments = payments?.filter(p => {
        const paymentDate = new Date(p.created_at)
        return paymentDate.getMonth() === date.getMonth() && paymentDate.getFullYear() === date.getFullYear()
      }) || []
      
      const revenue = monthPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
      const commission = revenue * 0.15
      const bookings = monthPayments.length
      
      monthly_trends.push({ month, revenue, commission, bookings })
    }

    return {
      id: business.id,
      date: new Date().toISOString(),
      type: 'summary',
      amount: total_revenue,
      description: 'Business financial summary',
      status: 'active',
      total_revenue,
      total_commission,
      pending_payouts,
      failed_payments,
      monthly_trends
    }
  } catch (error) {
    console.error('Error fetching business financial data:', error)
    return null
  }
}

// Fetch business reviews
export async function getBusinessReviews(businessEmail: string): Promise<BusinessReviewData[]> {
  const supabase = createClient()
  
  try {
    // First get the business owner user ID from email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', businessEmail)
      .single()
    
    if (userError) throw userError
    if (!user) return []

    // Get business ID
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user.id)
      .single()
    
    if (businessError) throw businessError
    if (!business) return []

    // Get reviews with related data
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        booking_id,
        booking:bookings(
          booking_date,
          service_id,
          customer_id,
          service:services!inner(name),
          customer:users!inner(name, email)
        )
      `)
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error

    return reviews?.map(review => ({
      id: review.id,
      customer_name: (review.booking as any)?.customer?.name || 'Unknown',
      customer_email: (review.booking as any)?.customer?.email || 'Unknown',
      rating: review.rating,
      comment: review.comment,
      service_name: (review.booking as any)?.service?.name || 'Unknown Service',
      booking_date: (review.booking as any)?.booking_date || '',
      created_at: review.created_at,
      is_verified: true // Assume all reviews are verified for now
    })) || []
  } catch (error) {
    console.error('Error fetching business reviews:', error)
    return []
  }
}

// Fetch business statistics
export async function getBusinessStats(businessEmail: string): Promise<BusinessStats> {
  const supabase = createClient()
  
  try {
    // First get the business owner user ID from email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', businessEmail)
      .single()
    
    if (userError) throw userError
    if (!user) return getDefaultBusinessStats()

    // Get business ID
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user.id)
      .single()
    
    if (businessError) throw businessError
    if (!business) return getDefaultBusinessStats()

    // Get all related data
    const [bookings, services, reviews, payments] = await Promise.all([
      supabase.from('bookings').select('*').eq('business_id', business.id),
      supabase.from('services').select('*').eq('business_id', business.id),
      supabase.from('reviews').select('*').eq('business_id', business.id),
      supabase.from('payments').select('*').eq('business_id', business.id)
    ])

    const bookingsData = bookings.data || []
    const servicesData = services.data || []
    const reviewsData = reviews.data || []
    const paymentsData = payments.data || []

    // Calculate statistics
    const totalRevenue = paymentsData.reduce((sum, p) => sum + (p.amount || 0), 0)
    const totalBookings = bookingsData.length
    const completedBookings = bookingsData.filter(b => b.status === 'completed').length
    const pendingBookings = bookingsData.filter(b => b.status === 'pending').length
    const cancelledBookings = bookingsData.filter(b => b.status === 'cancelled').length
    const averageRating = reviewsData.length > 0 
      ? reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length 
      : 0
    const totalReviews = reviewsData.length
    const totalServices = servicesData.length
    const activeServices = servicesData.filter(s => s.status === 'active').length
    
    // Calculate customer statistics
    const uniqueCustomers = new Set(bookingsData.map(b => b.customer_id)).size
    const repeatCustomers = bookingsData
      .reduce((acc, b) => {
        acc[b.customer_id] = (acc[b.customer_id] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    const repeatCustomersCount = Object.values(repeatCustomers).filter((count: any) => count > 1).length
    const newCustomers = uniqueCustomers - repeatCustomersCount
    
    const conversionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0
    
    // Calculate commission and payouts
    const totalCommission = bookingsData.reduce((sum, b) => sum + (b.commission_amount || 0), 0)
    const pendingPayouts = paymentsData
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + (p.amount || 0), 0)
    
    // Calculate upcoming and today bookings
    const today = new Date().toISOString().split('T')[0]
    const upcomingBookings = bookingsData.filter(b => 
      b.booking_date > today && b.status === 'confirmed'
    ).length
    const todayBookings = bookingsData.filter(b => 
      b.booking_date === today
    ).length

    return {
      totalRevenue,
      totalBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      averageRating,
      totalReviews,
      totalServices,
      activeServices,
      totalCustomers: uniqueCustomers,
      repeatCustomers: repeatCustomersCount,
      newCustomers,
      conversionRate,
      averageBookingValue,
      totalCommission,
      pendingPayouts,
      upcomingBookings,
      todayBookings
    }
  } catch (error) {
    console.error('Error fetching business stats:', error)
    return getDefaultBusinessStats()
  }
}

// Default business stats for fallback
function getDefaultBusinessStats(): BusinessStats {
  return {
    totalRevenue: 0,
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    averageRating: 0,
    totalReviews: 0,
    totalServices: 0,
    activeServices: 0,
    totalCustomers: 0,
    repeatCustomers: 0,
    newCustomers: 0,
    conversionRate: 0,
    averageBookingValue: 0,
    totalCommission: 0,
    pendingPayouts: 0,
    upcomingBookings: 0,
    todayBookings: 0
  }
}
