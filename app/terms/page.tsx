"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-foreground mt-4">Terms and Conditions</h1>
            <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Terms Content */}
          <div className="prose prose-gray max-w-none">
            <div className="bg-card rounded-lg p-8 border space-y-6">
              
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground mb-4">
                  By accessing and using PointMe ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground mb-4">
                  PointMe is a platform that connects customers with local service providers. We facilitate the booking and management of various services including but not limited to cleaning, maintenance, and other home services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Accounts</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    <strong>3.1 Account Creation:</strong> You must create an account to use certain features of the Platform. You are responsible for maintaining the confidentiality of your account information.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>3.2 Account Security:</strong> You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>3.3 Account Types:</strong> The Platform supports different user types including customers, service providers, and administrators.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Service Provider Responsibilities</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    <strong>4.1 Service Quality:</strong> Service providers must deliver services in accordance with the description provided and maintain professional standards.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>4.2 Insurance:</strong> Service providers are responsible for maintaining appropriate insurance coverage for their services.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>4.3 Compliance:</strong> Service providers must comply with all applicable laws and regulations in their jurisdiction.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Customer Responsibilities</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    <strong>5.1 Accurate Information:</strong> Customers must provide accurate and complete information when booking services.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>5.2 Payment:</strong> Customers are responsible for timely payment of all charges for services booked through the Platform.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>5.3 Cooperation:</strong> Customers must provide reasonable cooperation to service providers to enable them to deliver services effectively.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Payment and Fees</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    <strong>6.1 Service Fees:</strong> Service fees are set by individual service providers and displayed on the Platform.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>6.2 Platform Fees:</strong> PointMe may charge platform fees for facilitating transactions.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>6.3 Payment Processing:</strong> All payments are processed through secure third-party payment processors.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Cancellation and Refunds</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    <strong>7.1 Cancellation Policy:</strong> Cancellation policies are set by individual service providers and displayed at the time of booking.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>7.2 Refunds:</strong> Refund policies are determined by the service provider and applicable laws.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Privacy and Data Protection</h2>
                <p className="text-muted-foreground mb-4">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Platform, to understand our practices regarding the collection and use of your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Intellectual Property</h2>
                <p className="text-muted-foreground mb-4">
                  The Platform and its original content, features, and functionality are and will remain the exclusive property of PointMe and its licensors. The Platform is protected by copyright, trademark, and other laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Limitation of Liability</h2>
                <p className="text-muted-foreground mb-4">
                  PointMe shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">11. Dispute Resolution</h2>
                <p className="text-muted-foreground mb-4">
                  Any disputes arising from the use of the Platform shall be resolved through good faith negotiations. If resolution cannot be reached, disputes may be submitted to binding arbitration in accordance with applicable laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">12. Modifications to Terms</h2>
                <p className="text-muted-foreground mb-4">
                  PointMe reserves the right to modify these terms at any time. We will notify users of any material changes via email or through the Platform. Continued use of the Platform after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">13. Contact Information</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about these Terms and Conditions, please contact us at:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-muted-foreground">
                    <strong>Email:</strong> support@pointme.com<br />
                    <strong>Phone:</strong> +27 11 123 4567<br />
                    <strong>Address:</strong> 123 Main Street, Johannesburg, South Africa
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


