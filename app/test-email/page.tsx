"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase"
import { Mail, AlertCircle, CheckCircle } from "lucide-react"

export default function TestEmailPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info")

  const testPasswordReset = async () => {
    if (!email) {
      setMessage("Please enter an email address")
      setMessageType("error")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const supabase = createClient()
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        console.error('Password reset error:', error)
        setMessage(`Error: ${error.message}`)
        setMessageType("error")
      } else {
        setMessage("Password reset email sent successfully! Check your inbox.")
        setMessageType("success")
      }
    } catch (error) {
      console.error('Test email error:', error)
      setMessage("Failed to send test email. Please check your SMTP configuration.")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  const testSignUp = async () => {
    if (!email) {
      setMessage("Please enter an email address")
      setMessageType("error")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const supabase = createClient()
      
      const { error } = await supabase.auth.signUp({
        email,
        password: "testpassword123",
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('Sign up error:', error)
        setMessage(`Error: ${error.message}`)
        setMessageType("error")
      } else {
        setMessage("Sign up email sent successfully! Check your inbox.")
        setMessageType("success")
      }
    } catch (error) {
      console.error('Test signup error:', error)
      setMessage("Failed to send signup email. Please check your SMTP configuration.")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration Test
            </CardTitle>
            <CardDescription>
              Test your Supabase email configuration to ensure authentication emails are working
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="mt-2"
              />
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

            <div className="flex gap-4">
              <Button 
                onClick={testPasswordReset} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Sending..." : "Test Password Reset"}
              </Button>
              <Button 
                onClick={testSignUp} 
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                {isLoading ? "Sending..." : "Test Sign Up"}
              </Button>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">SMTP Configuration Check</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Make sure your Supabase SMTP settings are configured correctly:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Host: <code className="bg-background px-1 rounded">smtp.gmail.com</code> (not localhost)</li>
                <li>• Port: <code className="bg-background px-1 rounded">465</code></li>
                <li>• Username: <code className="bg-background px-1 rounded">asiveyotwana@gmail.com</code></li>
                <li>• Password: <code className="bg-background px-1 rounded">Gmail App Password</code></li>
                <li>• Enable SSL/TLS</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Important Notes</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Check your spam folder if emails don't appear in your inbox</li>
                <li>• Gmail requires an App Password for SMTP (not your regular password)</li>
                <li>• Make sure 2-Step Verification is enabled on your Google Account</li>
                <li>• The test emails will be sent from your configured sender email</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

