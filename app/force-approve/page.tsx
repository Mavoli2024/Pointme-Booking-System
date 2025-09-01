"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function ForceApprovePage() {
  const [email, setEmail] = useState("mavolideveloper@gmail.com")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleForceApprove = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/business/force-approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message, business: data.business })
      } else {
        setResult({ success: false, message: data.error })
      }
    } catch (error) {
      setResult({ success: false, message: "Network error occurred" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Force Approve Business
          </CardTitle>
          <CardDescription>
            Approve a business account for testing purposes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Business Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter business email"
            />
          </div>

          <Button 
            onClick={handleForceApprove} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Approving..." : "Force Approve Business"}
          </Button>

          {result && (
            <div className={`p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span className="font-medium">{result.message}</span>
              </div>
              {result.success && result.business && (
                <div className="mt-2 text-sm">
                  <p><strong>Business ID:</strong> {result.business.id}</p>
                  <p><strong>Status:</strong> {result.business.status}</p>
                  <p><strong>Name:</strong> {result.business.name || 'Not set'}</p>
                </div>
              )}
            </div>
          )}

          {result?.success && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Next Steps:</h3>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Go to <a href="/business/dashboard" className="underline">Business Dashboard</a></li>
                <li>2. You should now see the full dashboard instead of pending approval</li>
                <li>3. Start creating services and managing your business</li>
              </ol>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


