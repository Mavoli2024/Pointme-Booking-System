import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET() {
  try {
    const startTime = Date.now()
    
    // Check database connection
    const supabase = createClient()
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    const dbResponseTime = Date.now() - startTime
    
    if (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Database connection failed',
          error: error.message,
          timestamp: new Date().toISOString(),
          responseTime: dbResponseTime,
        },
        { status: 503 }
      )
    }
    
    // Check environment variables
    const envCheck = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      appUrl: !!process.env.NEXT_PUBLIC_APP_URL,
    }
    
    const allEnvVarsSet = Object.values(envCheck).every(Boolean)
    
    if (!allEnvVarsSet) {
      return NextResponse.json(
        {
          status: 'warning',
          message: 'Some environment variables are missing',
          environment: envCheck,
          timestamp: new Date().toISOString(),
          responseTime: dbResponseTime,
        },
        { status: 200 }
      )
    }
    
    return NextResponse.json({
      status: 'healthy',
      message: 'All systems operational',
      timestamp: new Date().toISOString(),
      responseTime: dbResponseTime,
      environment: envCheck,
      version: process.env.npm_package_version || '1.0.0',
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

