"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { 
  Users, 
  Building2, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  TrendingUp,
  UserCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Star,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Filter,
  Search,
  Plus,
  MoreHorizontal,
  Activity,
  Shield,
  Database,
  Zap,
  Bell,
  FileText,
  CreditCard,
  PieChart,
  LineChart,
  Globe,
  Target,
  Award,
  CalendarDays,
  Clock4,
  UserPlus,
  Building,
  FileCheck,
  AlertCircle,
  CheckSquare,
  XSquare,
  Pause,
  Play,
  RotateCcw,
  Save,
  RefreshCw,
  BarChart,
  TrendingDown,
  Users2,
  ShoppingCart,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  PhoneCall,
  Send,
  Archive,
  Flag,
  Lock,
  Unlock,
  EyeOff,
  FileDown,
  FileUp,
  Copy,
  Share,
  Link,
  ExternalLink,
  Maximize,
  Minimize,
  Fullscreen,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  Crop,
  Type,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  Quote,
  Code,
  Image,
  Video,
  Music,
  File,
  Folder,
  FolderOpen,
  FolderPlus,
  FolderMinus,
  FolderX,
  FolderCheck,
  FolderSearch,
  FolderHeart,
  FolderLock,
  FolderKey,
  FolderCog,
  FolderArchive,
  FolderDown,
  FolderUp,
  FolderCode
} from "lucide-react"
import { createClient } from "@/lib/supabase"

// Database Table Management Types
interface TableData {
  name: string
  records: number
  lastModified: string
  size: string
  status: 'active' | 'inactive' | 'error'
}

interface DatabaseRecord {
  id: string
  [key: string]: any
}

interface TableSchema {
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [tables, setTables] = useState<TableData[]>([])
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [tableData, setTableData] = useState<DatabaseRecord[]>([])
  const [tableSchema, setTableSchema] = useState<TableSchema[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showAddRecord, setShowAddRecord] = useState(false)
  const [editingRecord, setEditingRecord] = useState<DatabaseRecord | null>(null)
  const [newRecord, setNewRecord] = useState<{[key: string]: any}>({})
  const [tableLoading, setTableLoading] = useState(false)
  
  // Business Management State
  const [pendingBusinesses, setPendingBusinesses] = useState<any[]>([])
  const [allBusinesses, setAllBusinesses] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])

  // Financial Model State
  const [financialBusinesses, setFinancialBusinesses] = useState<any[]>([])
  const [serviceTypes, setServiceTypes] = useState([
    { type: "Beauty & Wellness", defaultRate: 8.5 },
    { type: "Fitness & Health", defaultRate: 12.0 },
    { type: "Technology Services", defaultRate: 15.0 },
    { type: "Food & Beverage", defaultRate: 10.0 },
    { type: "Professional Services", defaultRate: 18.0 },
    { type: "Entertainment", defaultRate: 14.0 }
  ])

  const [editingBusiness, setEditingBusiness] = useState<any>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newBusiness, setNewBusiness] = useState({
    name: '',
    serviceType: '',
    commissionRate: 0,
    monthlyBookings: 0,
    averageBookingValue: 0,
    status: 'active',
    email: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      console.log('Starting to fetch dashboard data...')
      const supabase = createClient()
      
      // First, try to get all tables from information_schema
      let allTables: string[] = []
      
      try {
        // Try to get table names from information_schema
        const { data: tableNames, error: tableError } = await supabase
          .rpc('get_table_names')
        
        if (!tableError && tableNames) {
          allTables = tableNames
        } else {
          // Fallback: try direct query to information_schema
          const { data: schemaData, error: schemaError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
          
          if (!schemaError && schemaData) {
            allTables = schemaData.map(row => row.table_name)
          }
        }
      } catch (error) {
        console.log('Could not fetch table names from information_schema, using known tables')
      }
      
      // If we couldn't get table names, use the known tables from your database
      if (allTables.length === 0) {
        allTables = [
          'users',
          'services', 
          'reviews',
          'service_categories',
          'service_images',
          'service_ratings',
          'promo_codes',
          'support_tickets',
          'user_sessions',
          'bookings',
          'payments',
          'businesses',
          'notifications',
          'business_hours',
          'business_documents',
          'availability_slots',
          'commissions'
        ]
      }

      console.log('Detected tables:', allTables)

      // Get table statistics for all detected tables
      const tableStats = await Promise.all(
        allTables.map(async (tableName) => {
          try {
            const { count, error } = await supabase
              .from(tableName)
              .select('*', { count: 'exact', head: true })

            return {
              name: tableName,
              records: count || 0,
              lastModified: new Date().toISOString(),
              size: 'Unknown',
              status: (error ? 'error' : 'active') as 'active' | 'inactive' | 'error'
            }
          } catch (error) {
            console.log(`Error checking table ${tableName}:`, error)
            return {
              name: tableName,
              records: 0,
              lastModified: new Date().toISOString(),
              size: 'Unknown',
              status: 'error' as 'active' | 'inactive' | 'error'
            }
          }
        })
      )

      setTables(tableStats)
      console.log('Tables loaded:', tableStats)

      // Fetch real data for each section
      await Promise.all([
        fetchUsers(),
        fetchServices(),
        fetchReviews(),
        fetchBookings(),
        fetchFinancialData()
      ])

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        return
      }

      setUsers(data || [])
      console.log('Users loaded:', data?.length || 0)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchServices = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching services:', error)
        return
      }

      setServices(data || [])
      console.log('Services loaded:', data?.length || 0)
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const fetchReviews = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching reviews:', error)
        return
      }

      setReviews(data || [])
      console.log('Reviews loaded:', data?.length || 0)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const fetchBookings = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching bookings:', error)
        return
      }

      setBookings(data || [])
      console.log('Bookings loaded:', data?.length || 0)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const fetchFinancialData = async () => {
    try {
      const supabase = createClient()
      
      // Fetch businesses with their services and booking data
      const { data: businessesData, error: businessesError } = await supabase
        .from('businesses')
        .select(`
          *,
          services (
            id,
            name,
            price,
            bookings (
              id,
              total_amount,
              created_at
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (businessesError) {
        console.error('Error fetching businesses:', businessesError)
        return
      }

      // Process businesses to calculate financial metrics
      const processedBusinesses = businessesData?.map(business => {
        // Calculate monthly bookings and average booking value
        const allBookings = business.services?.flatMap((service: any) => 
          service.bookings || []
        ) || []
        
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        
        const monthlyBookings = allBookings.filter((booking: any) => {
          const bookingDate = new Date(booking.created_at)
          return bookingDate.getMonth() === currentMonth && 
                 bookingDate.getFullYear() === currentYear
        })

        const totalMonthlyRevenue = monthlyBookings.reduce((sum: number, booking: any) => 
          sum + (booking.total_amount || 0), 0
        )

        const averageBookingValue = monthlyBookings.length > 0 
          ? totalMonthlyRevenue / monthlyBookings.length 
          : 0

        // Get commission rate from business category or use default
        const defaultRate = serviceTypes.find(s => s.type === business.category)?.defaultRate || 10.0

        return {
          id: business.id,
          name: business.name,
          serviceType: business.category || 'Other',
          commissionRate: business.commission_rate || defaultRate,
          monthlyBookings: monthlyBookings.length,
          averageBookingValue: averageBookingValue,
          status: business.status || 'active',
          email: business.email,
          phone: business.phone,
          address: business.address
        }
      }) || []

      setFinancialBusinesses(processedBusinesses)
      console.log('Financial businesses loaded:', processedBusinesses.length)
    } catch (error) {
      console.error('Error fetching financial data:', error)
    }
  }

  const fetchTableData = async (tableName: string) => {
    try {
      console.log('Fetching table data for:', tableName)
      setTableLoading(true)
      const supabase = createClient()
      
      // Set selected table immediately for better UX
      setSelectedTable(tableName)
      
      // Try to get table schema dynamically
      let schema: any[] = []
      
      try {
        // First, try to get a sample record to understand the structure
        const { data: sampleData, error: sampleError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        console.log('Sample data result:', { sampleData, sampleError })
        
        if (!sampleError && sampleData && sampleData.length > 0) {
          // Generate schema from sample data
          schema = Object.keys(sampleData[0]).map(key => ({
            column_name: key,
            data_type: typeof sampleData[0][key] === 'number' ? 'numeric' : 
                      typeof sampleData[0][key] === 'boolean' ? 'boolean' :
                      sampleData[0][key] instanceof Date ? 'timestamp' :
                      key.includes('id') ? 'uuid' : 'text',
            is_nullable: 'YES',
            column_default: null
          }))
          console.log('Generated schema from sample:', schema)
        } else if (sampleError) {
          console.error('Error getting sample data:', sampleError)
        }
      } catch (error) {
        console.log('Could not get sample data for schema detection:', error)
      }
      
      // Fallback to predefined schemas if dynamic detection fails
      if (schema.length === 0) {
        const tableSchemas: { [key: string]: any[] } = {
          users: [
            { column_name: 'id', data_type: 'uuid' },
            { column_name: 'email', data_type: 'text' },
            { column_name: 'name', data_type: 'text' },
            { column_name: 'role', data_type: 'text' },
            { column_name: 'created_at', data_type: 'timestamp' }
          ],
          services: [
            { column_name: 'id', data_type: 'uuid' },
            { column_name: 'name', data_type: 'text' },
            { column_name: 'description', data_type: 'text' },
            { column_name: 'price', data_type: 'numeric' },
            { column_name: 'duration', data_type: 'integer' },
            { column_name: 'business_id', data_type: 'uuid' },
            { column_name: 'category_id', data_type: 'uuid' },
            { column_name: 'created_at', data_type: 'timestamp' }
          ],
          reviews: [
            { column_name: 'id', data_type: 'uuid' },
            { column_name: 'rating', data_type: 'integer' },
            { column_name: 'comment', data_type: 'text' },
            { column_name: 'user_id', data_type: 'uuid' },
            { column_name: 'service_id', data_type: 'uuid' },
            { column_name: 'created_at', data_type: 'timestamp' }
          ],
          service_categories: [
            { column_name: 'id', data_type: 'uuid' },
            { column_name: 'name', data_type: 'text' },
            { column_name: 'description', data_type: 'text' },
            { column_name: 'icon', data_type: 'text' },
            { column_name: 'created_at', data_type: 'timestamp' }
          ],
          service_images: [
            { column_name: 'id', data_type: 'uuid' },
            { column_name: 'service_id', data_type: 'uuid' },
            { column_name: 'image_url', data_type: 'text' },
            { column_name: 'alt_text', data_type: 'text' },
            { column_name: 'created_at', data_type: 'timestamp' }
          ],
          service_ratings: [
            { column_name: 'id', data_type: 'uuid' },
            { column_name: 'service_id', data_type: 'uuid' },
            { column_name: 'user_id', data_type: 'uuid' },
            { column_name: 'rating', data_type: 'integer' },
            { column_name: 'created_at', data_type: 'timestamp' }
          ],
          promo_codes: [
            { column_name: 'id', data_type: 'uuid' },
            { column_name: 'code', data_type: 'text' },
            { column_name: 'discount_percentage', data_type: 'numeric' },
            { column_name: 'valid_until', data_type: 'timestamp' },
            { column_name: 'created_at', data_type: 'timestamp' }
          ],
          support_tickets: [
            { column_name: 'id', data_type: 'uuid' },
            { column_name: 'user_id', data_type: 'uuid' },
            { column_name: 'subject', data_type: 'text' },
            { column_name: 'message', data_type: 'text' },
            { column_name: 'status', data_type: 'text' },
            { column_name: 'created_at', data_type: 'timestamp' }
          ],
          user_sessions: [
            { column_name: 'id', data_type: 'uuid' },
            { column_name: 'user_id', data_type: 'uuid' },
            { column_name: 'session_token', data_type: 'text' },
            { column_name: 'expires_at', data_type: 'timestamp' },
            { column_name: 'created_at', data_type: 'timestamp' }
          ],
          bookings: [
            { column_name: 'id', data_type: 'uuid' },
            { column_name: 'customer_email', data_type: 'text' },
            { column_name: 'customer_name', data_type: 'text' },
            { column_name: 'customer_phone', data_type: 'text' },
            { column_name: 'business_id', data_type: 'uuid' },
            { column_name: 'service_id', data_type: 'uuid' },
            { column_name: 'booking_date', data_type: 'date' },
            { column_name: 'booking_time', data_type: 'time' },
            { column_name: 'status', data_type: 'text' },
            { column_name: 'total_amount', data_type: 'numeric' },
            { column_name: 'payment_status', data_type: 'text' },
            { column_name: 'payment_method', data_type: 'text' },
            { column_name: 'special_instructions', data_type: 'text' },
            { column_name: 'created_at', data_type: 'timestamp' }
          ],
          payments: [
            { column_name: 'id', data_type: 'uuid' },
            { column_name: 'booking_id', data_type: 'uuid' },
            { column_name: 'amount', data_type: 'numeric' },
            { column_name: 'payment_method', data_type: 'text' },
            { column_name: 'status', data_type: 'text' },
            { column_name: 'transaction_id', data_type: 'text' },
            { column_name: 'created_at', data_type: 'timestamp' }
          ],
          businesses: [
            { column_name: 'id', data_type: 'uuid' },
            { column_name: 'name', data_type: 'text' },
            { column_name: 'email', data_type: 'text' },
            { column_name: 'phone', data_type: 'text' },
            { column_name: 'address', data_type: 'text' },
            { column_name: 'category', data_type: 'text' },
            { column_name: 'status', data_type: 'text' },
            { column_name: 'rating', data_type: 'numeric' },
            { column_name: 'created_at', data_type: 'timestamp' }
          ],
          notifications: [
            { column_name: 'id', data_type: 'uuid' },
            { column_name: 'user_id', data_type: 'uuid' },
            { column_name: 'title', data_type: 'text' },
            { column_name: 'message', data_type: 'text' },
            { column_name: 'type', data_type: 'text' },
            { column_name: 'read', data_type: 'boolean' },
            { column_name: 'created_at', data_type: 'timestamp' }
          ]
        }
        
        schema = tableSchemas[tableName] || [
          { column_name: 'id', data_type: 'uuid' },
          { column_name: 'created_at', data_type: 'timestamp' }
        ]
      }

      setTableSchema(schema)

      // Get table data from Supabase
      console.log('Fetching records from table:', tableName)
      const { data: recordsData, error: recordsError } = await supabase
        .from(tableName)
        .select('*')
        .limit(100)
        .order('created_at', { ascending: false })

      console.log('Records fetch result:', { recordsData, recordsError })

      if (recordsError) {
        console.error('Error fetching records:', recordsError)
        alert(`Error fetching records: ${recordsError.message}`)
        return
      }

      setTableData(recordsData || [])
      console.log(`Loaded ${recordsData?.length || 0} records from ${tableName}`)
      console.log('Table data set:', recordsData)
    } catch (error) {
      console.error('Error fetching table data:', error)
      alert(`Error fetching table data: ${error}`)
    } finally {
      setTableLoading(false)
    }
  }

  const addRecord = async () => {
    try {
      const supabase = createClient()
      
      // Process the record data to handle different types
      const processedRecord = { ...newRecord }
      
      // Convert data types based on schema
      tableSchema.forEach(column => {
        const value = processedRecord[column.column_name]
        if (value !== undefined && value !== '') {
          if (column.data_type === 'numeric' || column.data_type === 'integer') {
            processedRecord[column.column_name] = parseFloat(value) || 0
          } else if (column.data_type === 'boolean') {
            processedRecord[column.column_name] = value === 'true' || value === true
          } else if (column.data_type === 'timestamp' && column.column_name !== 'created_at') {
            // Don't modify created_at, let Supabase handle it
            if (value) {
              processedRecord[column.column_name] = new Date(value).toISOString()
            }
          }
        }
      })
      
      // Remove empty values and id (let Supabase generate it)
      Object.keys(processedRecord).forEach(key => {
        if (processedRecord[key] === '' || key === 'id') {
          delete processedRecord[key]
        }
      })
      
      const { data, error } = await supabase
        .from(selectedTable)
        .insert(processedRecord)
        .select()

      if (error) {
        console.error('Error adding record:', error)
        alert(`Error adding record: ${error.message}`)
        return
      }

      alert('Record added successfully!')
      // Refresh table data
      fetchTableData(selectedTable)
      setShowAddRecord(false)
      setNewRecord({})
    } catch (error) {
      console.error('Error adding record:', error)
      alert(`Error adding record: ${error}`)
    }
  }

  const updateRecord = async (id: string, updates: any) => {
    try {
      const supabase = createClient()
      
      // Process the update data to handle different types
      const processedUpdates = { ...updates }
      
      // Convert data types based on schema
      tableSchema.forEach(column => {
        const value = processedUpdates[column.column_name]
        if (value !== undefined && value !== '') {
          if (column.data_type === 'numeric' || column.data_type === 'integer') {
            processedUpdates[column.column_name] = parseFloat(value) || 0
          } else if (column.data_type === 'boolean') {
            processedUpdates[column.column_name] = value === 'true' || value === true
          } else if (column.data_type === 'timestamp' && column.column_name !== 'created_at') {
            // Don't modify created_at
            if (value) {
              processedUpdates[column.column_name] = new Date(value).toISOString()
            }
          }
        }
      })
      
      // Remove empty values and id
      Object.keys(processedUpdates).forEach(key => {
        if (processedUpdates[key] === '' || key === 'id') {
          delete processedUpdates[key]
        }
      })
      
      const { error } = await supabase
        .from(selectedTable)
        .update(processedUpdates)
        .eq('id', id)

      if (error) {
        console.error('Error updating record:', error)
        alert(`Error updating record: ${error.message}`)
        return
      }

      alert('Record updated successfully!')
      // Refresh table data
      fetchTableData(selectedTable)
      setEditingRecord(null)
    } catch (error) {
      console.error('Error updating record:', error)
      alert(`Error updating record: ${error}`)
    }
  }

  const deleteRecord = async (id: string) => {
    try {
      if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
        return
      }
      
      const supabase = createClient()
      
      const { error } = await supabase
        .from(selectedTable)
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting record:', error)
        alert(`Error deleting record: ${error.message}`)
        return
      }

      alert('Record deleted successfully!')
      // Refresh table data
      fetchTableData(selectedTable)
    } catch (error) {
      console.error('Error deleting record:', error)
      alert(`Error deleting record: ${error}`)
    }
  }

  const exportTableData = async (tableName: string) => {
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')

      if (error) {
        console.error('Error exporting data:', error)
        return
      }

      // Convert to CSV
      const csvContent = "data:text/csv;charset=utf-8," + 
        Object.keys(data[0] || {}).join(",") + "\n" +
        data.map(row => Object.values(row).join(",")).join("\n")
      
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `${tableName}_export.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  // Financial Model Functions
  const calculateRevenue = (business: any) => {
    const monthlyRevenue = business.monthlyBookings * business.averageBookingValue
    const commission = monthlyRevenue * (business.commissionRate / 100)
    return {
      monthlyRevenue,
      commission,
      annualRevenue: monthlyRevenue * 12,
      annualCommission: commission * 12
    }
  }

  const getTotalMetrics = () => {
    return financialBusinesses.reduce((totals, business) => {
      if (business.status === 'active') {
        const revenue = calculateRevenue(business)
        totals.monthlyRevenue += revenue.monthlyRevenue
        totals.monthlyCommission += revenue.commission
        totals.totalBookings += business.monthlyBookings
        totals.activeBusinesses += 1
      }
      return totals
    }, {
      monthlyRevenue: 0,
      monthlyCommission: 0,
      totalBookings: 0,
      activeBusinesses: 0
    })
  }

  const handleEdit = (business: any) => {
    setEditingBusiness({...business})
  }

  const handleSaveEdit = async () => {
    if (!editingBusiness) return
    
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('businesses')
        .update({
          name: editingBusiness.name,
          category: editingBusiness.serviceType,
          commission_rate: editingBusiness.commissionRate,
          status: editingBusiness.status,
          email: editingBusiness.email,
          phone: editingBusiness.phone,
          address: editingBusiness.address
        })
        .eq('id', editingBusiness.id)

      if (error) {
        console.error('Error updating business:', error)
        alert(`Error updating business: ${error.message}`)
        return
      }

      alert('Business updated successfully!')
      
      // Refresh financial data
      await fetchFinancialData()
      setEditingBusiness(null)
    } catch (error) {
      console.error('Error updating business:', error)
      alert(`Error updating business: ${error}`)
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this business?')) {
      setFinancialBusinesses(prev => prev.filter(b => b.id !== id))
    }
  }

  const handleAddBusiness = async () => {
    if (newBusiness.name && newBusiness.serviceType) {
      try {
        const supabase = createClient()
        const defaultRate = serviceTypes.find(s => s.type === newBusiness.serviceType)?.defaultRate || 10
        
        const { data, error } = await supabase
          .from('businesses')
          .insert({
            name: newBusiness.name,
            category: newBusiness.serviceType,
            commission_rate: newBusiness.commissionRate || defaultRate,
            status: newBusiness.status,
            email: newBusiness.email || '',
            phone: newBusiness.phone || '',
            address: newBusiness.address || ''
          })
          .select()

        if (error) {
          console.error('Error adding business:', error)
          alert(`Error adding business: ${error.message}`)
          return
        }

        alert('Business added successfully!')
        
        // Refresh financial data
        await fetchFinancialData()
        
        setNewBusiness({
          name: '',
          serviceType: '',
          commissionRate: 0,
          monthlyBookings: 0,
          averageBookingValue: 0,
          status: 'active',
          email: '',
          phone: '',
          address: ''
        })
        setShowAddForm(false)
      } catch (error) {
        console.error('Error adding business:', error)
        alert(`Error adding business: ${error}`)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your platform and database</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => fetchDashboardData()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Database className="h-4 w-4 mr-2" />
              Database Health
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tables.length}</div>
              <p className="text-xs text-muted-foreground">
                {tables.filter(t => t.status === 'active').length} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tables.reduce((sum, table) => sum + table.records, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all tables
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Healthy</div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Database Tables</CardTitle>
                  <CardDescription>Overview of all database tables</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tables.map((table) => (
                      <div key={table.name} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Database className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{table.name}</p>
                            <p className="text-sm text-muted-foreground">{table.records} records</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={table.status === 'active' ? 'default' : 'secondary'}>
                            {table.status}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => fetchTableData(table.name)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Database Connection</span>
                      <Badge variant="default" className="bg-green-500">Connected</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">API Response</span>
                      <Badge variant="default" className="bg-green-500">Fast</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Storage</span>
                      <Badge variant="default" className="bg-yellow-500">75% Used</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Backup Status</span>
                      <Badge variant="default" className="bg-green-500">Up to Date</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Database Management Tab */}
          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Database Management</CardTitle>
                    <CardDescription>Manage all Supabase tables and records</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Search tables..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Tables List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tables
                      .filter(table => 
                        table.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                        (filterStatus === 'all' || table.status === filterStatus)
                      )
                      .map((table) => (
                        <Card key={table.name} className="cursor-pointer hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{table.name}</CardTitle>
                              <Badge variant={table.status === 'active' ? 'default' : 'secondary'}>
                                {table.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Records:</span>
                                <span className="font-medium">{table.records.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Size:</span>
                                <span className="font-medium">{table.size}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Modified:</span>
                                <span className="font-medium text-xs">
                                  {new Date(table.lastModified).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2 mt-4">
                              <Button 
                                size="sm" 
                                onClick={() => fetchTableData(table.name)}
                                className="flex-1"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => exportTableData(table.name)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>

                  {/* Table Data Viewer */}
                  {selectedTable && (
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>{selectedTable} - Table Data</CardTitle>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm"
                              onClick={() => setShowAddRecord(true)}
                              disabled={tableLoading}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Record
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => exportTableData(selectedTable)}
                              disabled={tableLoading}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {tableLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <span className="ml-2">Loading table data...</span>
                          </div>
                        ) : tableSchema.length === 0 ? (
                          <div className="text-center py-8">
                            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                            <p className="text-muted-foreground">Could not detect table schema</p>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => fetchTableData(selectedTable)}
                              className="mt-2"
                            >
                              Retry
                            </Button>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  {tableSchema.map((column) => (
                                    <TableHead key={column.column_name}>{column.column_name}</TableHead>
                                  ))}
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {tableData.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={tableSchema.length + 1} className="text-center py-8">
                                      <div className="text-muted-foreground">
                                        <Database className="h-8 w-8 mx-auto mb-2" />
                                        <p>No records found in this table</p>
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          onClick={() => setShowAddRecord(true)}
                                          className="mt-2"
                                        >
                                          Add First Record
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  tableData.map((record, index) => (
                                    <TableRow key={record.id || index}>
                                      {tableSchema.map((column) => (
                                        <TableCell key={column.column_name}>
                                          {typeof record[column.column_name] === 'object' 
                                            ? JSON.stringify(record[column.column_name])
                                            : String(record[column.column_name] || '')
                                          }
                                        </TableCell>
                                      ))}
                                      <TableCell>
                                        <div className="flex space-x-2">
                                          <Button 
                                            size="sm" 
                                            variant="ghost"
                                            onClick={() => setEditingRecord(record)}
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button 
                                            size="sm" 
                                            variant="ghost"
                                            onClick={() => deleteRecord(record.id)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and their data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name || 'N/A'}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role || 'user'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Management</CardTitle>
                <CardDescription>Manage platform services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell>{service.name}</TableCell>
                          <TableCell>{service.description || 'N/A'}</TableCell>
                          <TableCell>R{service.price}</TableCell>
                          <TableCell>{service.duration} min</TableCell>
                          <TableCell>
                            {new Date(service.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Management</CardTitle>
                <CardDescription>Manage user reviews and ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rating</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Service ID</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              {review.rating}
                            </div>
                          </TableCell>
                          <TableCell>{review.comment || 'N/A'}</TableCell>
                          <TableCell>{review.user_id}</TableCell>
                          <TableCell>{review.service_id}</TableCell>
                          <TableCell>
                            {new Date(review.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking System Financial Model</CardTitle>
                <CardDescription>Manage business commission rates and track platform revenue</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Key Metrics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {(() => {
                    const totals = getTotalMetrics()
                    return (
                      <>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">${totals.monthlyRevenue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Total platform revenue</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Commission</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">${totals.monthlyCommission.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Platform commission</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{totals.totalBookings.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Monthly bookings</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Businesses</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{totals.activeBusinesses}</div>
                            <p className="text-xs text-muted-foreground">Active partners</p>
                          </CardContent>
                        </Card>
                      </>
                    )
                  })()}
                </div>

                {/* Service Type Commission Rates */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Service Type Commission Rates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {serviceTypes.map((service, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <p className="font-medium">{service.type}</p>
                          <p className="text-sm text-muted-foreground">Default: {service.defaultRate}%</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Business Management */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Business Management</CardTitle>
                      <Button onClick={() => setShowAddForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Business
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Add Business Form */}
                    {showAddForm && (
                      <Card className="mb-6">
                        <CardHeader>
                          <CardTitle>Add New Business</CardTitle>
                        </CardHeader>
                        <CardContent>
                                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                             <Input
                               placeholder="Business Name"
                               value={newBusiness.name}
                               onChange={(e) => setNewBusiness(prev => ({...prev, name: e.target.value}))}
                             />
                             <Select
                               value={newBusiness.serviceType}
                               onValueChange={(value) => setNewBusiness(prev => ({...prev, serviceType: value}))}
                             >
                               <SelectTrigger>
                                 <SelectValue placeholder="Select Service Type" />
                               </SelectTrigger>
                               <SelectContent>
                                 {serviceTypes.map((service, index) => (
                                   <SelectItem key={index} value={service.type}>{service.type}</SelectItem>
                                 ))}
                               </SelectContent>
                             </Select>
                             <Input
                               type="number"
                               placeholder="Commission Rate (%)"
                               value={newBusiness.commissionRate}
                               onChange={(e) => setNewBusiness(prev => ({...prev, commissionRate: parseFloat(e.target.value) || 0}))}
                             />
                             <Input
                               placeholder="Email"
                               value={newBusiness.email}
                               onChange={(e) => setNewBusiness(prev => ({...prev, email: e.target.value}))}
                             />
                             <Input
                               placeholder="Phone"
                               value={newBusiness.phone}
                               onChange={(e) => setNewBusiness(prev => ({...prev, phone: e.target.value}))}
                             />
                             <Input
                               placeholder="Address"
                               value={newBusiness.address}
                               onChange={(e) => setNewBusiness(prev => ({...prev, address: e.target.value}))}
                             />
                            <div className="flex gap-2">
                              <Button onClick={handleAddBusiness} className="flex-1">
                                <Save className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Business Table */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Business</TableHead>
                            <TableHead>Service Type</TableHead>
                            <TableHead>Commission %</TableHead>
                            <TableHead>Monthly Bookings</TableHead>
                            <TableHead>Avg Booking Value</TableHead>
                            <TableHead>Monthly Commission</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {financialBusinesses.map((business) => {
                            const revenue = calculateRevenue(business)
                            const isEditing = editingBusiness && editingBusiness.id === business.id
                            
                            return (
                              <TableRow key={business.id} className={business.status === 'inactive' ? 'opacity-60' : ''}>
                                <TableCell>
                                  {isEditing ? (
                                    <Input
                                      value={editingBusiness.name}
                                      onChange={(e) => setEditingBusiness(prev => ({...prev, name: e.target.value}))}
                                    />
                                  ) : (
                                    <div className="font-medium">{business.name}</div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {isEditing ? (
                                    <Select
                                      value={editingBusiness.serviceType}
                                      onValueChange={(value) => setEditingBusiness(prev => ({...prev, serviceType: value}))}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {serviceTypes.map((service, index) => (
                                          <SelectItem key={index} value={service.type}>{service.type}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <div>{business.serviceType}</div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {isEditing ? (
                                    <Input
                                      type="number"
                                      step="0.1"
                                      value={editingBusiness.commissionRate}
                                      onChange={(e) => setEditingBusiness(prev => ({...prev, commissionRate: parseFloat(e.target.value) || 0}))}
                                      className="w-20"
                                    />
                                  ) : (
                                    <div>{business.commissionRate}%</div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {isEditing ? (
                                    <Input
                                      type="number"
                                      value={editingBusiness.monthlyBookings}
                                      onChange={(e) => setEditingBusiness(prev => ({...prev, monthlyBookings: parseInt(e.target.value) || 0}))}
                                      className="w-20"
                                    />
                                  ) : (
                                    <div>{business.monthlyBookings}</div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {isEditing ? (
                                    <Input
                                      type="number"
                                      value={editingBusiness.averageBookingValue}
                                      onChange={(e) => setEditingBusiness(prev => ({...prev, averageBookingValue: parseFloat(e.target.value) || 0}))}
                                      className="w-20"
                                    />
                                  ) : (
                                    <div>${business.averageBookingValue}</div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium text-green-600">
                                    ${revenue.commission.toLocaleString()}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={business.status === 'active' ? 'default' : 'secondary'}>
                                    {business.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {isEditing ? (
                                    <div className="flex space-x-2">
                                      <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                                        <Save className="h-4 w-4" />
                                      </Button>
                                      <Button size="sm" variant="ghost" onClick={() => setEditingBusiness(null)}>
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex space-x-2">
                                      <Button size="sm" variant="ghost" onClick={() => handleEdit(business)}>
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button size="sm" variant="ghost" onClick={() => handleDelete(business.id)}>
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Annual Projections */}
                    <Card className="mt-8">
                      <CardHeader>
                        <CardTitle>Annual Projections</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {(() => {
                            const totals = getTotalMetrics()
                            return (
                              <>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground mb-1">Annual Platform Revenue</p>
                                  <p className="text-2xl font-bold text-blue-600">
                                    ${(totals.monthlyRevenue * 12).toLocaleString()}
                                  </p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground mb-1">Annual Commission Revenue</p>
                                  <p className="text-2xl font-bold text-green-600">
                                    ${(totals.monthlyCommission * 12).toLocaleString()}
                                  </p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground mb-1">Average Commission Rate</p>
                                  <p className="text-2xl font-bold text-purple-600">
                                    {totals.monthlyRevenue > 0 ? ((totals.monthlyCommission / totals.monthlyRevenue) * 100).toFixed(1) : 0}%
                                  </p>
                                </div>
                              </>
                            )
                          })()}
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <Switch id="sms-notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-approve">Auto-approve Services</Label>
                    <Switch id="auto-approve" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <Switch id="maintenance-mode" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Database Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="backup-frequency">Backup Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="retention-days">Data Retention (days)</Label>
                    <Input id="retention-days" type="number" defaultValue={365} />
                  </div>
                  <div>
                    <Label htmlFor="max-connections">Max Connections</Label>
                    <Input id="max-connections" type="number" defaultValue={100} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Record Dialog */}
        <Dialog open={showAddRecord} onOpenChange={setShowAddRecord}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Record to {selectedTable}</DialogTitle>
              <DialogDescription>
                Add a new record to the {selectedTable} table
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {tableSchema.map((column) => {
                // Skip id and created_at fields for new records
                if (column.column_name === 'id' || column.column_name === 'created_at') {
                  return null
                }
                
                return (
                  <div key={column.column_name}>
                    <Label htmlFor={column.column_name}>
                      {column.column_name}
                      {column.data_type && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({column.data_type})
                        </span>
                      )}
                    </Label>
                    {column.data_type === 'boolean' ? (
                      <Select
                        value={newRecord[column.column_name]?.toString() || ''}
                        onValueChange={(value) => setNewRecord({
                          ...newRecord,
                          [column.column_name]: value === 'true'
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${column.column_name}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">True</SelectItem>
                          <SelectItem value="false">False</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : column.data_type === 'text' || column.data_type === 'character varying' ? (
                      <Textarea
                        id={column.column_name}
                        placeholder={`Enter ${column.column_name}`}
                        value={newRecord[column.column_name] || ''}
                        onChange={(e) => setNewRecord({
                          ...newRecord,
                          [column.column_name]: e.target.value
                        })}
                      />
                    ) : column.data_type === 'timestamp' ? (
                      <Input
                        id={column.column_name}
                        type="datetime-local"
                        placeholder={`Enter ${column.column_name}`}
                        value={newRecord[column.column_name] || ''}
                        onChange={(e) => setNewRecord({
                          ...newRecord,
                          [column.column_name]: e.target.value
                        })}
                      />
                    ) : (
                      <Input
                        id={column.column_name}
                        type={column.data_type === 'integer' || column.data_type === 'numeric' ? 'number' : 'text'}
                        placeholder={`Enter ${column.column_name}`}
                        value={newRecord[column.column_name] || ''}
                        onChange={(e) => setNewRecord({
                          ...newRecord,
                          [column.column_name]: e.target.value
                        })}
                      />
                    )}
                  </div>
                )
              })}
              <div className="flex space-x-2">
                <Button onClick={addRecord}>Add Record</Button>
                <Button variant="outline" onClick={() => setShowAddRecord(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Record Dialog */}
        <Dialog open={!!editingRecord} onOpenChange={() => setEditingRecord(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Record in {selectedTable}</DialogTitle>
              <DialogDescription>
                Edit the selected record
              </DialogDescription>
            </DialogHeader>
            {editingRecord && (
              <div className="space-y-4">
                {tableSchema.map((column) => {
                  // Skip id and created_at fields for editing
                  if (column.column_name === 'id' || column.column_name === 'created_at') {
                    return (
                      <div key={column.column_name}>
                        <Label htmlFor={column.column_name}>
                          {column.column_name}
                          <span className="text-xs text-muted-foreground ml-2">
                            ({column.data_type}) - Read Only
                          </span>
                        </Label>
                        <Input
                          id={column.column_name}
                          value={editingRecord[column.column_name] || ''}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    )
                  }
                  
                  return (
                    <div key={column.column_name}>
                      <Label htmlFor={column.column_name}>
                        {column.column_name}
                        {column.data_type && (
                          <span className="text-xs text-muted-foreground ml-2">
                            ({column.data_type})
                          </span>
                        )}
                      </Label>
                      {column.data_type === 'boolean' ? (
                        <Select
                          value={editingRecord[column.column_name]?.toString() || ''}
                          onValueChange={(value) => setEditingRecord({
                            ...editingRecord,
                            [column.column_name]: value === 'true'
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${column.column_name}`} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">True</SelectItem>
                            <SelectItem value="false">False</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : column.data_type === 'text' || column.data_type === 'character varying' ? (
                        <Textarea
                          id={column.column_name}
                          placeholder={`Enter ${column.column_name}`}
                          value={editingRecord[column.column_name] || ''}
                          onChange={(e) => setEditingRecord({
                            ...editingRecord,
                            [column.column_name]: e.target.value
                          })}
                        />
                      ) : column.data_type === 'timestamp' ? (
                        <Input
                          id={column.column_name}
                          type="datetime-local"
                          placeholder={`Enter ${column.column_name}`}
                          value={editingRecord[column.column_name] ? 
                            new Date(editingRecord[column.column_name]).toISOString().slice(0, 16) : ''}
                          onChange={(e) => setEditingRecord({
                            ...editingRecord,
                            [column.column_name]: e.target.value
                          })}
                        />
                      ) : (
                        <Input
                          id={column.column_name}
                          type={column.data_type === 'integer' || column.data_type === 'numeric' ? 'number' : 'text'}
                          placeholder={`Enter ${column.column_name}`}
                          value={editingRecord[column.column_name] || ''}
                          onChange={(e) => setEditingRecord({
                            ...editingRecord,
                            [column.column_name]: e.target.value
                          })}
                        />
                      )}
                    </div>
                  )
                })}
                <div className="flex space-x-2">
                  <Button onClick={() => updateRecord(editingRecord.id, editingRecord)}>Update Record</Button>
                  <Button variant="outline" onClick={() => setEditingRecord(null)}>Cancel</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
