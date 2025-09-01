const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database schema...')
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'SUPABASE_SCHEMA.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)
          const { error } = await supabase.rpc('exec_sql', { sql: statement })
          
          if (error) {
            console.warn(`⚠️  Warning on statement ${i + 1}:`, error.message)
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`)
          }
        } catch (err) {
          console.warn(`⚠️  Error on statement ${i + 1}:`, err.message)
        }
      }
    }
    
    console.log('✅ Database setup completed!')
    
    // Test the connection by checking if tables exist
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (error) {
      console.warn('⚠️  Could not verify tables:', error.message)
    } else {
      console.log('📊 Tables found:', tables.map(t => t.table_name).join(', '))
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    process.exit(1)
  }
}

// Alternative method using direct SQL execution
async function setupDatabaseDirect() {
  try {
    console.log('🚀 Setting up database schema (direct method)...')
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'SUPABASE_SCHEMA.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // For now, just log what we would do
    console.log('📝 Schema file loaded successfully')
    console.log('⚠️  Note: You need to run this SQL in your Supabase SQL editor')
    console.log('📋 Copy the contents of SUPABASE_SCHEMA.sql and paste it into:')
    console.log('   https://supabase.com/dashboard/project/kazxsniyffosngltskkm/sql')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    process.exit(1)
  }
}

// Run the setup
setupDatabaseDirect()
