import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Shield, Zap, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h1 className="text-5xl md:text-7xl font-black mb-6 text-balance leading-tight">
                Streamline Your <span className="text-secondary font-black">Service Bookings</span>
              </h1>
              <p className="text-2xl mb-8 text-white font-medium leading-relaxed text-pretty">
                PointMe! helps businesses manage appointments and customers book services - all in one place. Join
                thousands of South African businesses already growing with us.
              </p>
              <div className="bg-white rounded-lg p-6 max-w-md shadow-xl">
                <h3 className="text-foreground font-bold text-xl mb-4">Find Services Near You</h3>
                <div className="space-y-3">
                  <Input
                    placeholder="What service do you need?"
                    className="w-full text-lg py-3 text-foreground placeholder:text-muted-foreground border-border focus:border-primary"
                  />
                  <Input
                    placeholder="City or Location"
                    className="w-full text-lg py-3 text-foreground placeholder:text-muted-foreground border-border focus:border-primary"
                  />
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-lg py-3">
                    <Search className="h-5 w-5 mr-2" />
                    Search Services
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EPIgSvuSJ57FTJaiClWytpvsOZrFZq.png"
                alt="Professional consultation meeting"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Verified Professionals</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                All service providers are verified and background-checked
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Rated & Reviewed</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Real reviews from verified customers help you choose
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Instant Booking</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Book services instantly with real-time availability
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Popular Services</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
              Discover the most requested services in your area
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Home Cleaning",
                provider: "CleanPro Services",
                rating: 4.9,
                reviews: 127,
                price: "From R800",
                location: "Cape Town",
                image: "/professional-home-cleaning.png",
              },
              {
                title: "Plumbing Repair",
                provider: "Fix-It Fast",
                rating: 4.8,
                reviews: 89,
                price: "From R1200",
                location: "Johannesburg",
                image: "/professional-plumber-working.png",
              },
              {
                title: "Hair Styling",
                provider: "Bella Beauty Salon",
                rating: 5.0,
                reviews: 203,
                price: "From R600",
                location: "Durban",
                image: "/professional-hair-salon-styling.png",
              },
            ].map((service, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow border-2">
                <div className="aspect-video bg-muted">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-xl text-foreground">{service.title}</h3>
                    <Badge
                      variant="secondary"
                      className="bg-secondary text-secondary-foreground font-bold text-sm px-3 py-1"
                    >
                      {service.price}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-base mb-3 font-medium">{service.provider}</p>
                  <div className="flex items-center justify-between text-base">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 fill-secondary text-secondary" />
                      <span className="font-bold text-foreground">{service.rating}</span>
                      <span className="text-muted-foreground font-medium">({service.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground font-medium">
                      <MapPin className="h-5 w-5" />
                      <span>{service.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-18 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-white">Ready to Get Started?</h2>
          <p className="text-2xl mb-10 text-white font-medium leading-relaxed">
            Join thousands of satisfied customers and service providers on PointMe!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/register?type=customer">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-lg px-8 py-4"
              >
                Book a Service
              </Button>
            </Link>
            <Link href="/auth/register?type=business">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-bold text-lg px-8 py-4"
              >
                Grow Your Business
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-10 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">PointMe!</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Connecting customers with trusted local service professionals across South Africa.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/services" className="hover:text-foreground transition-colors">
                    Find Services
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-foreground transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-foreground transition-colors">
                    Customer Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Businesses</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/business/register" className="hover:text-foreground transition-colors">
                    Join as Provider
                  </Link>
                </li>
                <li>
                  <Link href="/business/resources" className="hover:text-foreground transition-colors">
                    Business Resources
                  </Link>
                </li>
                <li>
                  <Link href="/business/support" className="hover:text-foreground transition-colors">
                    Business Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 PointMe! Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
