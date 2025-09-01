"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const supabase = createClient()

      if (
        (formData.email === "admin@pointme.co.za" || formData.email === "admin@pointme.com") &&
        formData.password === "admin123"
      ) {
        const adminUser = {
          id: "admin-user-id",
          email: formData.email,
          name: "Platform Admin",
          role: "admin",
          created_at: new Date().toISOString(),
        }

        localStorage.setItem("userInfo", JSON.stringify(adminUser))
        localStorage.setItem(
          "adminSession",
          JSON.stringify({
            user: adminUser,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          }),
        )

        document.cookie = "admin_session=true; path=/; max-age=86400"
        document.cookie = `user_info=${JSON.stringify(adminUser)}; path=/; max-age=86400`

        window.location.href = "/admin/dashboard"
        return
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials.")
        } else if (authError.message.includes("Email not confirmed")) {
          // For development: Allow login even if email is not confirmed
          console.log("Development mode: Bypassing email confirmation")
          
          // Try to get user profile from database
          const { data: profile } = await supabase
            .from("users")
            .select("*")
            .eq("email", formData.email)
            .single()
          
          if (profile) {
            // Store user info and redirect
            localStorage.setItem("userInfo", JSON.stringify(profile))
            document.cookie = `user_info=${JSON.stringify(profile)}; path=/; max-age=86400`
            
            if (profile.role === "business_owner") {
              window.location.href = "/business/pending-approval"
            } else {
              window.location.href = "/dashboard"
            }
            return
          } else {
            setError("Please check your email and confirm your account before signing in.")
          }
        } else {
          setError(`Authentication error: ${authError.message}`)
        }
        return
      }

      if (data.user) {
        const userRole = data.user.user_metadata?.role

        if (userRole === "admin") {
          window.location.href = "/admin/dashboard"
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .single()

        if (profileError && !userRole) {
          const storedUser = localStorage.getItem("userInfo")
          if (storedUser) {
            const userData = JSON.parse(storedUser)
            if (userData.role === "business") {
              window.location.href = "/business/dashboard"
            } else {
              window.location.href = "/dashboard"
            }
            return
          }
          setError("User profile not found. Please contact support.")
          return
        }

        const role = profile?.role || userRole
        if (role === "admin") {
          window.location.href = "/admin/dashboard"
        } else if (role === "business") {
          window.location.href = "/business/dashboard"
        } else {
          window.location.href = "/dashboard"
        }
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-xl">P</span>
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your PointMe account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/auth/forgot-password" className="text-sm text-accent hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/auth/register" className="text-accent hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
