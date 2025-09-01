export interface Notification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  timestamp: string
  read: boolean
  userId?: string
  actionUrl?: string
  priority: "low" | "medium" | "high"
  category: "booking" | "business" | "payment" | "system" | "general"
}

export class NotificationService {
  private static instance: NotificationService
  private notifications: Notification[] = []
  private listeners: ((notifications: Notification[]) => void)[] = []

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  private constructor() {
    this.loadNotifications()
  }

  private loadNotifications() {
    try {
      const stored = localStorage.getItem("pointme_notifications")
      if (stored) {
        this.notifications = JSON.parse(stored)
      }
    } catch (error) {
      console.error("Error loading notifications:", error)
    }
  }

  private saveNotifications() {
    try {
      localStorage.setItem("pointme_notifications", JSON.stringify(this.notifications))
      this.notifyListeners()
    } catch (error) {
      console.error("Error saving notifications:", error)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.notifications))
  }

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener)
    listener(this.notifications) // Send current notifications immediately

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  addNotification(notification: Omit<Notification, "id" | "timestamp" | "read">): string {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false,
    }

    this.notifications.unshift(newNotification)
    this.saveNotifications()
    return newNotification.id
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.saveNotifications()
    }
  }

  markAllAsRead(userId?: string) {
    this.notifications.forEach((notification) => {
      if (!userId || notification.userId === userId) {
        notification.read = true
      }
    })
    this.saveNotifications()
  }

  getNotifications(userId?: string): Notification[] {
    if (userId) {
      return this.notifications.filter((n) => !n.userId || n.userId === userId)
    }
    return this.notifications
  }

  getUnreadCount(userId?: string): number {
    return this.getNotifications(userId).filter((n) => !n.read).length
  }

  deleteNotification(notificationId: string) {
    this.notifications = this.notifications.filter((n) => n.id !== notificationId)
    this.saveNotifications()
  }

  // Predefined notification creators
  createBookingNotification(
    type: "confirmed" | "cancelled" | "completed",
    bookingId: string,
    customerName: string,
    businessName: string,
    userId?: string,
  ) {
    const messages = {
      confirmed: `Your booking with ${businessName} has been confirmed`,
      cancelled: `Your booking with ${businessName} has been cancelled`,
      completed: `Your booking with ${businessName} has been completed`,
    }

    return this.addNotification({
      type: type === "cancelled" ? "warning" : "success",
      title: `Booking ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      message: messages[type],
      userId,
      priority: "medium",
      category: "booking",
      actionUrl: `/bookings/${bookingId}`,
    })
  }

  createBusinessNotification(type: "approved" | "rejected", businessName: string, reason?: string, userId?: string) {
    const isApproved = type === "approved"

    return this.addNotification({
      type: isApproved ? "success" : "error",
      title: `Business Application ${isApproved ? "Approved" : "Rejected"}`,
      message: isApproved
        ? `Congratulations! ${businessName} has been approved and is now live on PointMe`
        : `Your application for ${businessName} was rejected. ${reason ? `Reason: ${reason}` : ""}`,
      userId,
      priority: "high",
      category: "business",
      actionUrl: isApproved ? "/business/dashboard" : "/business/reapply",
    })
  }

  createPaymentNotification(type: "success" | "failed", amount: number, userId?: string) {
    return this.addNotification({
      type: type === "success" ? "success" : "error",
      title: `Payment ${type === "success" ? "Successful" : "Failed"}`,
      message: `Payment of R${amount} ${type === "success" ? "was processed successfully" : "could not be processed"}`,
      userId,
      priority: "medium",
      category: "payment",
    })
  }

  createSystemNotification(title: string, message: string, priority: "low" | "medium" | "high" = "medium") {
    return this.addNotification({
      type: "info",
      title,
      message,
      priority,
      category: "system",
    })
  }
}

export const notificationService = NotificationService.getInstance()
