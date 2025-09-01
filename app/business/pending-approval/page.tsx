import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Application Under Review</CardTitle>
            <CardDescription>Thank you for registering your business with PointMe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Your business registration is currently being reviewed by our team. This process typically takes 1-2
                business days.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Document Verification</p>
                    <p className="text-sm text-muted-foreground">
                      We'll verify your business information and credentials
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Background Check</p>
                    <p className="text-sm text-muted-foreground">
                      Standard background verification for service providers
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Account Activation</p>
                    <p className="text-sm text-muted-foreground">
                      Once approved, you'll receive access to your business dashboard
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Application Received</span>
              </div>
              <p className="text-sm text-muted-foreground">
                We've received your application and will contact you if we need any additional information.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Need Help?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                  <Mail className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-medium text-sm">Email Support</p>
                    <p className="text-sm text-muted-foreground">business@pointme.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                  <Phone className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-medium text-sm">Phone Support</p>
                    <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Link href="/">
                <Button variant="outline">Return to Homepage</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
