// Enhanced database service for PointMe Platform
import { createClient } from "@/lib/supabase"
import type { User, Business, Service, Booking, Review, Notification, SupportTicket } from "@/lib/types"

export class DatabaseService {
  private supabase = createClient()

  // User operations
  async createUser(userData: Partial<User>) {
    try {
      const { data, error } = await this.supabase.from("users").insert(userData).select().single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Database error creating user:", error)
      return { data: null, error }
    }
  }

  async updateUser(userId: string, userData: Partial<User>) {
    try {
      const { data, error } = await this.supabase.from("users").update(userData).eq("id", userId).select().single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Database error updating user:", error)
      return { data: null, error }
    }
  }

  // Business operations
  async createBusiness(businessData: Partial<Business>) {
    try {
      const { data, error } = await this.supabase.from("businesses").insert(businessData).select().single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Database error creating business:", error)
      return { data: null, error }
    }
  }

  async getBusinessesByStatus(status: string) {
    try {
      const { data, error } = await this.supabase
        .from("businesses")
        .select(`
          *,
          users!businesses_owner_id_fkey(first_name, last_name, email, phone)
        `)
        .eq("status", status)
        .order("created_at", { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Database error fetching businesses:", error)
      return { data: null, error }
    }
  }

  async approveBusiness(businessId: string) {
    try {
      const { data, error } = await this.supabase
        .from("businesses")
        .update({ status: "approved", updated_at: new Date().toISOString() })
        .eq("id", businessId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Database error approving business:", error)
      return { data: null, error }
    }
  }

  // Service operations
  async createService(serviceData: Partial<Service>) {
    try {
      const { data, error } = await this.supabase.from("services").insert(serviceData).select().single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Database error creating service:", error)
      return { data: null, error }
    }
  }

  async getServicesByBusiness(businessId: string) {
    try {
      const { data, error } = await this.supabase
        .from("services")
        .select(`
          *,
          service_categories(name)
        `)
        .eq("business_id", businessId)
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Database error fetching services:", error)
      return { data: null, error }
    }
  }

  // Booking operations
  async createBooking(bookingData: Partial<Booking>) {
    try {
      const { data, error } = await this.supabase.from("bookings").insert(bookingData).select().single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Database error creating booking:", error)
      return { data: null, error }
    }
  }

  async getBookingsByCustomer(customerId: string) {
    try {
      const { data, error } = await this.supabase
        .from("bookings")
        .select(`
          *,
          services(name, price),
          businesses(name, phone),
          reviews(rating, comment)
        `)
        .eq("customer_id", customerId)
        .order("booking_date", { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Database error fetching customer bookings:", error)
      return { data: null, error }
    }
  }

  async getBookingsByBusiness(businessId: string) {
    try {
      const { data, error } = await this.supabase
        .from("bookings")
        .select(`
          *,
          users(first_name, last_name, email, phone),
          services(name, price),
          reviews(rating, comment)
        `)
        .eq("business_id", businessId)
        .order("booking_date", { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Database error fetching business bookings:", error)
      return { data: null, error }
    }
  }

  // Review operations
  async createReview(reviewData: Partial<Review>) {
    try {
      const { data, error } = await this.supabase.from("reviews").insert(reviewData).select().single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Database error creating review:", error)
      return { data: null, error }
    }
  }

  // Notification operations
  async createNotification(notificationData: Partial<Notification>) {
    try {
      const { data, error } = await this.supabase.from("notifications").insert(notificationData).select().single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Database error creating notification:", error)
      return { data: null, error }
    }
  }

  async getNotificationsByUser(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Database error fetching notifications:", error)
      return { data: null, error }
    }
  }

  // Support ticket operations
  async createSupportTicket(ticketData: Partial<SupportTicket>) {
    try {
      const { data, error } = await this.supabase.from("support_tickets").insert(ticketData).select().single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Database error creating support ticket:", error)
      return { data: null, error }
    }
  }

  // Service categories
  async getServiceCategories() {
    try {
      const { data, error } = await this.supabase.from("service_categories").select("*").order("name")

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error("Database error fetching service categories:", error)
      return { data: null, error }
    }
  }
}

export const db = new DatabaseService()
