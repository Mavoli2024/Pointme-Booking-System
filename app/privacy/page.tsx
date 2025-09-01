"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-foreground mt-4">Privacy Policy</h1>
            <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Privacy Content */}
          <div className="prose prose-gray max-w-none">
            <div className="bg-card rounded-lg p-8 border space-y-6">
              
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
                <p className="text-muted-foreground mb-4">
                  PointMe ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">2.1 Personal Information</h3>
                    <p className="text-muted-foreground">
                      We collect personal information you provide directly to us, including:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                      <li>Name and contact information (email, phone number)</li>
                      <li>Address and location information</li>
                      <li>Payment information</li>
                      <li>Service preferences and booking history</li>
                      <li>Communication preferences</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">2.2 Business Information</h3>
                    <p className="text-muted-foreground">
                      For service providers, we also collect:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                      <li>Business registration details</li>
                      <li>Service offerings and pricing</li>
                      <li>Professional qualifications and certifications</li>
                      <li>Insurance and licensing information</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">2.3 Automatically Collected Information</h3>
                    <p className="text-muted-foreground">
                      We automatically collect certain information when you use our platform:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                      <li>Device information (IP address, browser type, operating system)</li>
                      <li>Usage data (pages visited, time spent, features used)</li>
                      <li>Location data (with your consent)</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    <strong>3.1 Service Provision:</strong> To provide, maintain, and improve our services, including facilitating bookings and payments.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>3.2 Communication:</strong> To send you important updates, notifications, and marketing communications (with your consent).
                  </p>
                  <p className="text-muted-foreground">
                    <strong>3.3 Customer Support:</strong> To respond to your inquiries and provide customer support.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>3.4 Security:</strong> To protect against fraud, abuse, and security threats.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>3.5 Analytics:</strong> To analyze usage patterns and improve our platform.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Information Sharing</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    <strong>4.1 Service Providers:</strong> We share relevant information between customers and service providers to facilitate bookings.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>4.2 Third-Party Services:</strong> We may share information with trusted third-party service providers who assist us in operating our platform.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>4.3 Legal Requirements:</strong> We may disclose information when required by law or to protect our rights and safety.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>4.4 Business Transfers:</strong> In the event of a merger or acquisition, your information may be transferred to the new entity.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
                <p className="text-muted-foreground mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Rights</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    <strong>6.1 Access:</strong> You have the right to access and review your personal information.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>6.2 Correction:</strong> You can update or correct your personal information through your account settings.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>6.3 Deletion:</strong> You may request deletion of your account and associated data.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>6.4 Opt-out:</strong> You can opt out of marketing communications at any time.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>6.5 Data Portability:</strong> You may request a copy of your data in a portable format.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Cookies and Tracking</h2>
                <p className="text-muted-foreground mb-4">
                  We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Children's Privacy</h2>
                <p className="text-muted-foreground mb-4">
                  Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. International Data Transfers</h2>
                <p className="text-muted-foreground mb-4">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to This Policy</h2>
                <p className="text-muted-foreground mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our platform and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Us</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-muted-foreground">
                    <strong>Email:</strong> privacy@pointme.com<br />
                    <strong>Phone:</strong> +27 11 123 4567<br />
                    <strong>Address:</strong> 123 Main Street, Johannesburg, South Africa<br />
                    <strong>Data Protection Officer:</strong> dpo@pointme.com
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


