import { createClient } from "./supabase"

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  role: "customer" | "business_owner" | "admin"
  created_at: string
  updated_at: string
}

export interface Business {
  id: string
  name: string
  description: string
  category: string
  owner_id: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  postal_code: string
  status: "pending" | "approved" | "rejected"
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
  customer_name: string
  customer_email: string
  customer_phone: string
  notes?: string
  created_at: string
}

export interface DatabaseResult<T> {
  data: T | null
  error: Error | null
  success: boolean
}

export interface SupabaseResponse<T> {
  data: T | null
  error: { message: string } | null
}

export class DatabaseService {
  private supabase = createClient()

  private async executeWithFallback<T>(
    operation: () => Promise<T>,
    fallback: () => T,
    operationName: string,
  ): Promise<DatabaseResult<T>> {
    try {
      const result = await operation()
      return { data: result, error: null, success: true }
    } catch (error) {
      console.error(`Database error in ${operationName}, using fallback:`, error)
      try {
        const fallbackResult = fallback()
        return { data: fallbackResult, error: error as Error, success: false }
      } catch (fallbackError) {
        return {
          data: null,
          error: new Error(`Both database and fallback failed: ${error}, ${fallbackError}`),
          success: false,
        }
      }
    }
  }

  // User operations
  async createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<DatabaseResult<User>> {
    return this.executeWithFallback(
      async () => {
        const { data, error }: SupabaseResponse<User> = await this.supabase
          .from("users")
          .insert({
            ...userData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) throw new Error(error.message)
        return data!
      },
      () => {
        const user: User = {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...userData,
        }
        localStorage.setItem("pointme_user", JSON.stringify(user))
        return user
      },
      "createUser",
    )
  }

  async getUser(id: string): Promise<DatabaseResult<User>> {
    return this.executeWithFallback(
      async () => {
        const { data, error }: SupabaseResponse<User> = await this.supabase
          .from("users")
          .select("*")
          .eq("id", id)
          .single()

        if (error) throw new Error(error.message)
        return data!
      },
      () => {
        const stored = localStorage.getItem("pointme_user")
        if (!stored) throw new Error("User not found in localStorage")
        return JSON.parse(stored) as User
      },
      "getUser",
    )
  }

  // Business operations
  async createBusiness(
    businessData: Omit<Business, "id" | "created_at" | "updated_at">,
  ): Promise<DatabaseResult<Business>> {
    return this.executeWithFallback(
      async () => {
        const { data, error }: SupabaseResponse<Business> = await this.supabase
          .from("businesses")
          .insert({
            ...businessData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) throw new Error(error.message)
        return data!
      },
      () => {
        const business: Business = {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...businessData,
        }

        const existing = JSON.parse(localStorage.getItem("pointme_business_registrations") || "[]") as Business[]
        existing.push(business)
        localStorage.setItem("pointme_business_registrations", JSON.stringify(existing))
        return business
      },
      "createBusiness",
    )
  }

  async getPendingBusinesses(): Promise<DatabaseResult<Business[]>> {
    return this.executeWithFallback(
      async () => {
        const { data, error }: SupabaseResponse<Business[]> = await this.supabase
          .from("businesses")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: false })

        if (error) throw new Error(error.message)
        return data || []
      },
      () => {
        const stored = localStorage.getItem("pointme_business_registrations")
        const businesses = stored ? (JSON.parse(stored) as Business[]) : []
        return businesses.filter((b: Business) => b.status === "pending")
      },
      "getPendingBusinesses",
    )
  }

  async approveBusiness(businessId: string): Promise<DatabaseResult<boolean>> {
    return this.executeWithFallback(
      async () => {
        const { error } = await this.supabase
          .from("businesses")
          .update({
            status: "approved",
            updated_at: new Date().toISOString(),
          })
          .eq("id", businessId)

        if (error) throw new Error(error.message)
        return true
      },
      () => {
        const stored = localStorage.getItem("pointme_business_registrations")
        if (stored) {
          const businesses = JSON.parse(stored) as Business[]
          const updated = businesses.map((b: Business) =>
            b.id === businessId ? { ...b, status: "approved" as const, updated_at: new Date().toISOString() } : b,
          )
          localStorage.setItem("pointme_business_registrations", JSON.stringify(updated))
        }
        return true
      },
      "approveBusiness",
    )
  }

  // Booking operations
  async createBooking(bookingData: Omit<Booking, "id" | "created_at">): Promise<DatabaseResult<Booking>> {
    return this.executeWithFallback(
      async () => {
        const { data, error }: SupabaseResponse<Booking> = await this.supabase
          .from("bookings")
          .insert(bookingData)
          .select()
          .single()

        if (error) throw new Error(error.message)
        return data!
      },
      () => {
        const booking: Booking = {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          ...bookingData,
        }

        const bookingKey = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem(bookingKey, JSON.stringify(booking))
        return booking
      },
      "createBooking",
    )
  }

  async getUserBookings(userId: string): Promise<DatabaseResult<Booking[]>> {
    return this.executeWithFallback(
      async () => {
        const { data, error }: SupabaseResponse<Booking[]> = await this.supabase
          .from("bookings")
          .select(`
            *,
            services (
              name,
              businesses (
                name
              )
            )
          `)
          .eq("customer_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw new Error(error.message)
        return data || []
      },
      () => {
        const bookings: Booking[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key?.startsWith("booking_")) {
            const booking = JSON.parse(localStorage.getItem(key) || "{}")
            if (booking.customer_id === userId) {
              bookings.push(booking)
            }
          }
        }
        return bookings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      },
      "getUserBookings",
    )
  }
}

export const db = new DatabaseService()
