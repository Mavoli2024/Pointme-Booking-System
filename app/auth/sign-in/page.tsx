"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase"
import { Mail, Lock, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info")
  const [showResendButton, setShowResendButton] = useState(false)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Sign in error:', error)
        
        // Handle specific error cases
        if (error.message.includes('Email not confirmed')) {
          setMessage('Please check your email and click the confirmation link before signing in.')
          setMessageType("info")
          setShowResendButton(true)
        } else if (error.message.includes('Invalid login credentials')) {
          setMessage('Invalid email or password. Please check your credentials and try again.')
          setMessageType("error")
        } else {
          setMessage(`Error: ${error.message}`)
          setMessageType("error")
        }
      } else {
        setMessage("Sign in successful! Redirecting...")
        setMessageType("success")
        
        // Store user info in localStorage
        localStorage.setItem("userInfo", JSON.stringify({
          id: data.user?.id,
          email: data.user?.email,
          name: data.user?.user_metadata?.name || data.user?.email
        }))
        
        // Get user role from database to determine redirect
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user?.id)
          .single()
        
        // Redirect based on role after a short delay
        setTimeout(() => {
          if (userData?.role === 'business') {
            router.push("/business/dashboard")
          } else {
            router.push("/dashboard")
          }
        }, 1000)
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setMessage("Failed to sign in. Please try again.")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      setMessage('Please enter your email address first.')
      setMessageType("error")
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })

      if (error) {
        setMessage(`Error resending confirmation: ${error.message}`)
        setMessageType("error")
      } else {
        setMessage('Confirmation email sent! Please check your inbox.')
        setMessageType("success")
        setShowResendButton(false)
      }
    } catch (error) {
      setMessage('Failed to resend confirmation email. Please try again.')
      setMessageType("error")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Welcome back! Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {message && (
              <Alert className={messageType === "error" ? "border-red-200 bg-red-50" : 
                               messageType === "success" ? "border-green-200 bg-green-50" : 
                               "border-blue-200 bg-blue-50"}>
                {messageType === "error" ? (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                ) : messageType === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                )}
                <AlertDescription className={messageType === "error" ? "text-red-600" : 
                                           messageType === "success" ? "text-green-600" : 
                                           "text-blue-600"}>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {showResendButton && (
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={handleResendConfirmation}
                  className="w-full"
                >
                  Resend Confirmation Email
                </Button>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link href="/auth/forgot-password" className="text-sm text-muted-foreground hover:text-foreground">
              Forgot your password?
            </Link>
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/sign-up" className="text-foreground hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
