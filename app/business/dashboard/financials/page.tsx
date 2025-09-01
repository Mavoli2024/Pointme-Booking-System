"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, DollarSign, TrendingUp, Download, ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"

// Mock financial data
const financialSummary = {
  totalEarnings: 8160,
  platformFees: 408, // 5% of total earnings
  netEarnings: 7752,
  pendingPayouts: 1200,
  thisMonth: {
    bookings: 68,
    earnings: 8160,
    avgBookingValue: 120,
  },
  lastMonth: {
    bookings: 52,
    earnings: 6240,
    avgBookingValue: 120,
  },
}

const transactions = [
  {
    id: "TXN_1705789200000",
    date: "2024-01-20",
    customerName: "John Smith",
    serviceName: "Standard House Cleaning",
    amount: 120,
    platformFee: 6,
    netAmount: 114,
    status: "completed",
    payoutDate: "2024-01-22",
  },
  {
    id: "TXN_1705702800000",
    date: "2024-01-19",
    customerName: "Sarah Johnson",
    serviceName: "Deep Cleaning Service",
    amount: 200,
    platformFee: 10,
    netAmount: 190,
    status: "completed",
    payoutDate: "2024-01-21",
  },
  {
    id: "TXN_1705616400000",
    date: "2024-01-18",
    customerName: "Mike Rodriguez",
    serviceName: "Standard House Cleaning",
    amount: 120,
    platformFee: 6,
    netAmount: 114,
    status: "pending",
    payoutDate: "2024-01-20",
  },
  {
    id: "TXN_1705530000000",
    date: "2024-01-17",
    customerName: "Emily Davis",
    serviceName: "Deep Cleaning Service",
    amount: 200,
    platformFee: 10,
    netAmount: 190,
    status: "refunded",
    refundDate: "2024-01-18",
    refundReason: "Customer cancellation",
  },
]

const payouts = [
  {
    id: "PAYOUT_001",
    date: "2024-01-15",
    amount: 2280,
    status: "completed",
    method: "Bank Transfer",
    transactionCount: 20,
  },
  {
    id: "PAYOUT_002",
    date: "2024-01-08",
    amount: 1900,
    status: "completed",
    method: "Bank Transfer",
    transactionCount: 16,
  },
  {
    id: "PAYOUT_003",
    date: "2024-01-01",
    amount: 2660,
    status: "completed",
    method: "Bank Transfer",
    transactionCount: 22,
  },
]

export default function BusinessFinancialsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("this-month")

  const growthRate =
    ((financialSummary.thisMonth.earnings - financialSummary.lastMonth.earnings) /
      financialSummary.lastMonth.earnings) *
    100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/business/dashboard"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-foreground">PointMe Business</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Financial Dashboard</h1>
            <p className="text-muted-foreground">Track your earnings, fees, and payouts</p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${financialSummary.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {growthRate > 0 ? "+" : ""}
                {growthRate.toFixed(1)}% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${financialSummary.platformFees}</div>
              <p className="text-xs text-muted-foreground">5% commission on bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Earnings</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${financialSummary.netEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">After platform fees</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${financialSummary.pendingPayouts}</div>
              <p className="text-xs text-muted-foreground">Next payout: Jan 22</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your booking payments and commission breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{transaction.serviceName}</h3>
                            <Badge
                              variant={
                                transaction.status === "completed"
                                  ? "default"
                                  : transaction.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div>Customer: {transaction.customerName}</div>
                            <div>Date: {new Date(transaction.date).toLocaleDateString()}</div>
                            <div>Transaction ID: {transaction.id}</div>
                            {transaction.status === "refunded" && (
                              <div className="text-destructive">Refund Reason: {transaction.refundReason}</div>
                            )}
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="text-lg font-semibold">${transaction.amount}</div>
                          <div className="text-sm text-muted-foreground">Platform fee: ${transaction.platformFee}</div>
                          <div className="text-sm font-medium text-green-600">Net: ${transaction.netAmount}</div>
                          {transaction.payoutDate && (
                            <div className="text-xs text-muted-foreground">
                              Payout: {new Date(transaction.payoutDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>Your payment transfers to your bank account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payouts.map((payout) => (
                    <div key={payout.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">Payout {payout.id}</h3>
                            <Badge variant="default">{payout.status}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div>{payout.method}</div>
                            <div>{payout.transactionCount} transactions</div>
                            <div>Date: {new Date(payout.date).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">${payout.amount.toLocaleString()}</div>
                          <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Trend</CardTitle>
                  <CardDescription>Your monthly earnings over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <TrendingUp className="h-8 w-8 mr-2" />
                    <span>Earnings chart would go here</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Commission Breakdown</CardTitle>
                  <CardDescription>Platform fees vs net earnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <DollarSign className="h-8 w-8 mr-2" />
                    <span>Commission chart would go here</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
