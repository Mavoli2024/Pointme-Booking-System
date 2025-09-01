import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "PointMe Platform - Connect with Local Service Professionals",
  description:
    "Book trusted local services across South Africa. Connect customers with verified service professionals for home cleaning, repairs, beauty services, and more.",
  generator: "PointMe Platform",
  keywords: "local services, South Africa, home services, professional services, booking platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
