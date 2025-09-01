"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ToastNotification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  duration?: number
}

interface NotificationToastProps {
  notifications: ToastNotification[]
  onRemove: (id: string) => void
}

export function NotificationToast({ notifications, onRemove }: NotificationToastProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<ToastNotification[]>([])

  useEffect(() => {
    setVisibleNotifications(notifications)

    // Auto-remove notifications after duration
    notifications.forEach((notification) => {
      const duration = notification.duration || 5000
      setTimeout(() => {
        onRemove(notification.id)
      }, duration)
    })
  }, [notifications, onRemove])

  const getIcon = (type: ToastNotification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getBackgroundColor = (type: ToastNotification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
      case "error":
        return "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800"
      case "info":
        return "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800"
    }
  }

  if (visibleNotifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {visibleNotifications.map((notification) => (
        <Card
          key={notification.id}
          className={`p-4 shadow-lg animate-in slide-in-from-right-full ${getBackgroundColor(notification.type)}`}
        >
          <div className="flex items-start space-x-3">
            {getIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-foreground">{notification.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-transparent"
              onClick={() => onRemove(notification.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

// Toast notification hook
export function useToast() {
  const [toasts, setToasts] = useState<ToastNotification[]>([])

  const addToast = (toast: Omit<ToastNotification, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])
    return id
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const success = (title: string, message: string, duration?: number) => {
    return addToast({ type: "success", title, message, duration })
  }

  const error = (title: string, message: string, duration?: number) => {
    return addToast({ type: "error", title, message, duration })
  }

  const warning = (title: string, message: string, duration?: number) => {
    return addToast({ type: "warning", title, message, duration })
  }

  const info = (title: string, message: string, duration?: number) => {
    return addToast({ type: "info", title, message, duration })
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}
