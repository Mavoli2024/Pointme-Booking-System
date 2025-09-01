import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, CreditCard, Star, Shield } from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="bg-primary py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-8">How PointMe! Works</h1>
          <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
            Connecting customers with trusted service providers in just a few simple steps
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">For Customers</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">Book trusted services in 4 easy steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                icon: Search,
                title: "Search Services",
                description: "Browse or search for the service you need in your area",
              },
              {
                step: "2",
                icon: Calendar,
                title: "Choose & Book",
                description: "Select your preferred provider and book an available time slot",
              },
              {
                step: "3",
                icon: CreditCard,
                title: "Secure Payment",
                description: "Pay securely through our platform with multiple payment options",
              },
              {
                step: "4",
                icon: Star,
                title: "Rate & Review",
                description: "Share your experience to help other customers make informed choices",
              },
            ].map((item, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="p-0">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <Badge variant="secondary" className="mb-4">
                    Step {item.step}
                  </Badge>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">For Service Providers</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">Grow your business with our platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Get Verified",
                description: "Complete our verification process to build trust with customers",
              },
              {
                icon: Calendar,
                title: "Manage Bookings",
                description: "Use our dashboard to manage appointments, availability, and customer communications",
              },
              {
                icon: CreditCard,
                title: "Get Paid",
                description: "Receive payments automatically after completing services (5% platform fee)",
              },
            ].map((item, index) => (
              <Card key={index} className="text-center p-8">
                <CardContent className="p-0">
                  <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <item.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground text-lg">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Ready to Get Started?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/register?type=customer">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Find Services
              </Button>
            </Link>
            <Link href="/auth/register?type=business">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-primary"
              >
                Join as Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
