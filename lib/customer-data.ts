import { createClient } from './supabase'

export interface CustomerBookingData {
  id: string
  booking_date: string
  booking_time: string
  status: string
  service_name: string
  business_name: string
  total_amount: number
  payment_status: string
  payment_method: string
  customer_email: string
  customer_phone: string
  notes?: string
  created_at: string
  service: {
    name: string
    price: number
    description?: string
    duration?: number
  }
  business: {
    name: string
    email: string
    phone: string
    address: string
    rating: number
  }
  review?: {
    rating: number
    comment: string
    created_at: string
  }
}

export interface CustomerPaymentData {
  id: string
  amount: number
  status: string
  payment_method: string
  created_at: string
  booking: {
    service_name: string
    business_name: string
  }
}

export interface CustomerNotificationData {
  id: string
  title: string
  message: string
  read: boolean
  created_at: string
  type: string
}

export interface CustomerProfileData {
  id: string
  name: string
  email: string
  phone?: string
  avatar_url?: string
  email_verified: boolean
  phone_verified: boolean
  created_at: string
  total_bookings: number
  total_spent: number
  favorite_services: string[]
}

export interface CustomerStats {
  totalBookings: number
  completedBookings: number
  pendingBookings: number
  cancelledBookings: number
  totalSpent: number
  averageRating: number
  favoriteCategory: string
  upcomingBookings: number
}

// Fetch customer bookings
export async function getCustomerBookings(customerEmail: string): Promise<CustomerBookingData[]> {
  const supabase = createClient()
  
  try {
    // Get current user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Auth error:', authError)
      return []
    }
    
    if (!user) {
      console.error('No authenticated user found')
      return []
    }

    // Get bookings with related data using customer_email instead of customer_id
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
        service_id,
        business_id,
        customer_name,
        customer_email,
        customer_phone,
        service:services(name, price, description, duration),
        business:businesses(name, email, phone, address, rating)
      `)
      .eq('customer_email', customerEmail)
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
        service_name: booking.service?.name || 'Unknown Service',
        business_name: booking.business?.name || 'Unknown Business',
        total_amount: booking.total_amount,
        payment_status: booking.payment_status,
        payment_method: payment?.payment_method || 'unknown',
        customer_email: booking.customer_email || customerEmail,
        customer_phone: booking.customer_phone || '',
        notes: booking.notes,
        created_at: booking.created_at,
        service: {
          name: booking.service?.name || 'Unknown Service',
          price: booking.service?.price || 0,
          description: booking.service?.description,
          duration: booking.service?.duration
        },
        business: {
          name: booking.business?.name || 'Unknown Business',
          email: booking.business?.email || '',
          phone: booking.business?.phone || '',
          address: booking.business?.address || '',
          rating: booking.business?.rating || 0
        },
        review: review ? {
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at
        } : undefined
      }
    }) || []
  } catch (error) {
    console.error('Error fetching customer bookings:', error)
    return []
  }
}

// Fetch customer payments
export async function getCustomerPayments(customerEmail: string): Promise<CustomerPaymentData[]> {
  const supabase = createClient()
  
  try {
    // Get payments by customer email
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        id,
        amount,
        status,
        payment_method,
        created_at,
        booking_id,
        booking:bookings(
          customer_email,
          service:services(name),
          business:businesses(name)
        )
      `)
      .eq('booking.customer_email', customerEmail)
      .order('created_at', { ascending: false })
    
    if (error) throw error

    return payments?.map(payment => ({
      id: payment.id,
      amount: payment.amount,
      status: payment.status,
      payment_method: payment.payment_method,
      created_at: payment.created_at,
      booking: {
        service_name: payment.booking?.service?.name || 'Unknown Service',
        business_name: payment.booking?.business?.name || 'Unknown Business'
      }
    })) || []
  } catch (error) {
    console.error('Error fetching customer payments:', error)
    return []
  }
}

// Fetch customer notifications
export async function getCustomerNotifications(customerEmail: string): Promise<CustomerNotificationData[]> {
  const supabase = createClient()
  
  try {
    // Get current user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Auth error:', authError)
      return []
    }
    
    if (!user) {
      console.error('No authenticated user found')
      return []
    }

    // Get notifications
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('id, title, message, read, type, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) throw error

    return notifications?.map(notification => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      read: notification.read,
      created_at: notification.created_at,
      type: notification.type
    })) || []
  } catch (error) {
    console.error('Error fetching customer notifications:', error)
    return []
  }
}

// Fetch customer profile
export async function getCustomerProfile(customerEmail: string): Promise<CustomerProfileData | null> {
  const supabase = createClient()
  
  try {
    // Get current user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Auth error:', authError)
      return null
    }
    
    if (!user) {
      console.error('No authenticated user found')
      return null
    }

    // Get booking statistics by email
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('total_amount')
      .eq('customer_email', customerEmail)
    
    if (bookingsError) throw bookingsError

    const total_bookings = bookings?.length || 0
    const total_spent = bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0

    // Get favorite services (most booked service categories)
    const { data: serviceBookings, error: serviceBookingsError } = await supabase
      .from('bookings')
      .select(`
        service:services(
          category:service_categories(name)
        )
      `)
      .eq('customer_email', customerEmail)
    
    if (serviceBookingsError) throw serviceBookingsError

    const serviceCounts: { [key: string]: number } = {}
    serviceBookings?.forEach(booking => {
      const categoryName = booking.service?.category?.name || 'General'
      serviceCounts[categoryName] = (serviceCounts[categoryName] || 0) + 1
    })

    const favorite_services = Object.entries(serviceCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category)

    return {
      id: user.id,
      name: user.user_metadata?.name || user.email || 'User',
      email: user.email || customerEmail,
      phone: user.phone || '',
      avatar_url: user.user_metadata?.avatar_url || '',
      email_verified: user.email_confirmed_at ? true : false,
      phone_verified: false,
      created_at: user.created_at || new Date().toISOString(),
      total_bookings,
      total_spent,
      favorite_services
    }
  } catch (error) {
    console.error('Error fetching customer profile:', error)
    return null
  }
}

// Fetch customer statistics
export async function getCustomerStats(customerEmail: string): Promise<CustomerStats> {
  const supabase = createClient()
  
  try {
    // Get all bookings for this customer by email
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        status,
        total_amount,
        booking_date,
        service:services(
          category:service_categories(name)
        )
      `)
      .eq('customer_email', customerEmail)
    
    if (error) throw error

    // Get reviews for rating calculation (using booking relationship)
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select(`
        rating,
        booking:bookings(customer_email)
      `)
      .eq('booking.customer_email', customerEmail)
    
    if (reviewsError) throw reviewsError

    // Calculate statistics
    const totalBookings = bookings?.length || 0
    const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0
    const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0
    const cancelledBookings = bookings?.filter(b => b.status === 'cancelled').length || 0
    const totalSpent = bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0
    
    const averageRating = reviews?.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0

    // Calculate favorite category
    const categoryCounts: { [key: string]: number } = {}
    bookings?.forEach(booking => {
      const categoryName = booking.service?.category?.name || 'General'
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1
    })

    const favoriteCategory = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'

    // Calculate upcoming bookings (bookings with future dates)
    const today = new Date()
    const upcomingBookings = bookings?.filter(b => {
      const bookingDate = new Date(b.booking_date)
      return bookingDate >= today && b.status === 'confirmed'
    }).length || 0

    return {
      totalBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      totalSpent,
      averageRating,
      favoriteCategory,
      upcomingBookings
    }
  } catch (error) {
    console.error('Error fetching customer stats:', error)
    return {
      totalBookings: 0,
      completedBookings: 0,
      pendingBookings: 0,
      cancelledBookings: 0,
      totalSpent: 0,
      averageRating: 0,
      favoriteCategory: 'None',
      upcomingBookings: 0
    }
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return false
  }
}

// Create a review for a booking
export async function createBookingReview(
  bookingId: string, 
  customerEmail: string, 
  rating: number, 
  comment: string
): Promise<boolean> {
  const supabase = createClient()
  
  try {
    // First get the user ID from email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', customerEmail)
      .single()
    
    if (userError) throw userError
    if (!user) return false

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('business_id')
      .eq('id', bookingId)
      .single()
    
    if (bookingError) throw bookingError
    if (!booking) return false

    // Create review
    const { error } = await supabase
      .from('reviews')
      .insert({
        customer_id: user.id,
        business_id: booking.business_id,
        booking_id: bookingId,
        rating,
        comment,
        is_verified: true
      })
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error creating review:', error)
    return false
  }
}
