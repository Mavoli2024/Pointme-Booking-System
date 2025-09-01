"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Mail, MessageSquare, Settings, Check, X, Clock } from "lucide-react"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "booking_confirmed",
      title: "Booking Confirmed",
      message: "Your home cleaning service with CleanPro Services has been confirmed for Dec 15, 2024 at 10:00 AM.",
      timestamp: "2 hours ago",
      read: false,
      priority: "high",
    },
    {
      id: 2,
      type: "payment_processed",
      title: "Payment Processed",
      message: "Payment of R800 for your booking has been successfully processed.",
      timestamp: "3 hours ago",
      read: false,
      priority: "medium",
    },
    {
      id: 3,
      type: "reminder",
      title: "Service Reminder",
      message: "Your plumbing repair appointment is scheduled for tomorrow at 2:00 PM.",
      timestamp: "1 day ago",
      read: true,
      priority: "medium",
    },
    {
      id: 4,
      type: "review_request",
      title: "Review Request",
      message: "How was your experience with Bella Beauty Salon? Leave a review to help other customers.",
      timestamp: "2 days ago",
      read: true,
      priority: "low",
    },
  ])

  const [settings, setSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    booking_confirmations: true,
    payment_updates: true,
    service_reminders: true,
    promotional_emails: false,
    review_requests: true,
  })

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking_confirmed":
        return <Check className="h-5 w-5 text-green-600" />
      case "payment_processed":
        return <Check className="h-5 w-5 text-blue-600" />
      case "reminder":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "review_request":
        return <MessageSquare className="h-5 w-5 text-purple-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-2">Stay updated with your bookings and account activity</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              {unreadCount} unread
            </Badge>
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              Mark all as read
            </Button>
          </div>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                  <p className="text-muted-foreground text-center">
                    You're all caught up! New notifications will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all ${!notification.read ? "border-primary/50 bg-primary/5" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3
                                className={`font-semibold ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                              >
                                {notification.title}
                              </h3>
                              <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                              {!notification.read && <div className="h-2 w-2 bg-primary rounded-full"></div>}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <Button onClick={() => markAsRead(notification.id)} variant="ghost" size="sm">
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              onClick={() => deleteNotification(notification.id)}
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Delivery Methods</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium">Email Notifications</label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={settings.email_notifications}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({ ...prev, email_notifications: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium">SMS Notifications</label>
                        <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        checked={settings.sms_notifications}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, sms_notifications: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium">Push Notifications</label>
                        <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                      </div>
                      <Switch
                        checked={settings.push_notifications}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, push_notifications: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Notification Types</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium">Booking Confirmations</label>
                        <p className="text-sm text-muted-foreground">When your booking is confirmed or cancelled</p>
                      </div>
                      <Switch
                        checked={settings.booking_confirmations}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({ ...prev, booking_confirmations: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium">Payment Updates</label>
                        <p className="text-sm text-muted-foreground">Payment confirmations and receipts</p>
                      </div>
                      <Switch
                        checked={settings.payment_updates}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, payment_updates: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium">Service Reminders</label>
                        <p className="text-sm text-muted-foreground">Reminders about upcoming appointments</p>
                      </div>
                      <Switch
                        checked={settings.service_reminders}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, service_reminders: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium">Review Requests</label>
                        <p className="text-sm text-muted-foreground">Requests to review completed services</p>
                      </div>
                      <Switch
                        checked={settings.review_requests}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, review_requests: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium">Promotional Emails</label>
                        <p className="text-sm text-muted-foreground">Special offers and platform updates</p>
                      </div>
                      <Switch
                        checked={settings.promotional_emails}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, promotional_emails: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="bg-primary hover:bg-primary/90">Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
