export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  name?: string
  role: "customer" | "business" | "admin"
  phone?: string
  status: "active" | "inactive"
  businessName?: string
  businessDescription?: string
  created_at: string
  updated_at: string
}

export interface Business {
  id: string
  owner_id: string
  name: string
  description: string
  address?: string
  city?: string
  phone: string
  email: string
  status: "pending" | "approved" | "rejected"
  services?: Service[]
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  business_id: string
  name: string
  description: string
  category: string
  price: number
  duration: number
  image_url?: string
  is_active: boolean
  business?: Business
  availability?: Record<string, string[]>
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  customer_id: string
  service_id: string
  business_id: string
  booking_date: string
  booking_time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  total_amount: number
  commission_amount: number
  customer_notes?: string
  payment_method?: "card" | "cash"
  service?: Service
  customer?: User
  business?: Business
  reviews?: Review[]
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  booking_id: string
  customer_id: string
  business_id: string
  rating: number
  comment?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  booking_id: string
  amount: number
  commission_amount: number
  status: "pending" | "completed" | "failed" | "refunded"
  payment_method: string
  transaction_id?: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "booking" | "payment" | "system" | "reminder"
  is_read: boolean
  created_at: string
}

export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  message: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  created_at: string
  updated_at: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  totalPages: number
}

export interface FormData {
  [key: string]: string | number | boolean | undefined | File
}

export interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  pendingBookings: number
  completedBookings: number
  totalCustomers: number
  totalBusinesses: number
  monthlyRevenue?: number[]
  recentBookings?: Booking[]
}

export interface ServiceCategory {
  id: string
  name: string
  description?: string
  icon?: string
  services_count?: number
}

export interface BookingData {
  id: string
  service_name: string
  business_name: string
  booking_date: string
  booking_time: string
  status: string
  total_amount: number
  payment_method?: string
  customer_notes?: string
}

export interface PaymentData {
  id: string
  booking_id: string
  amount: number
  status: string
  payment_method: string
  transaction_id?: string
  created_at: string
}

export interface NotificationData {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}

export interface UserProfileData {
  id: string
  email: string
  name: string
  phone?: string
  role: string
  businessName?: string
  businessDescription?: string
}

export interface EnvironmentConfig {
  supabaseUrl: string
  supabaseKey: string
  payFastMerchantId?: string
  payFastMerchantKey?: string
  payFastPassphrase?: string
  nodeEnv: string
}

export interface DatabaseResult<T = unknown> {
  data: T | null
  error: Error | null
  success: boolean
}

export interface SupabaseResponse<T = unknown> {
  data: T | null
  error: {
    message: string
    details?: string
    hint?: string
    code?: string
  } | null
}
