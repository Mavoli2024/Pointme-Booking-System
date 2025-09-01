// Utility script to create test users for development
// This bypasses email confirmation for testing purposes

const { createClient } = require('@supabase/supabase-js')

// You'll need to add your Supabase URL and anon key here
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTestUser(email, password, name, role = 'business') {
  try {
    console.log(`Creating test user: ${email}`)
    
    // Create user in Supabase auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        name: name,
        role: role
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return
    }

    console.log('Auth user created:', authData.user.id)

    // Create user record in users table
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: email,
        name: name,
        role: role,
        status: 'active'
      })

    if (userError) {
      console.error('User table error:', userError)
      return
    }

    console.log('User record created successfully')

    // If it's a business user, create a business record
    if (role === 'business') {
      const { error: businessError } = await supabase
        .from('businesses')
        .insert({
          owner_id: authData.user.id,
          name: `${name}'s Business`,
          description: 'Test business for development',
          email: email,
          phone: '+27123456789',
          address: '123 Test Street, Test City',
          status: 'approved'
        })

      if (businessError) {
        console.error('Business table error:', businessError)
        return
      }

      console.log('Business record created successfully')
    }

    console.log(`✅ Test user created successfully: ${email}`)
    console.log(`   Password: ${password}`)
    console.log(`   Role: ${role}`)

  } catch (error) {
    console.error('Error creating test user:', error)
  }
}

// Create test users
async function createTestUsers() {
  console.log('🚀 Creating test users for development...\n')

  // Test business user
  await createTestUser(
    'test@business.com',
    'test123',
    'Test Business Owner',
    'business'
  )

  // Test customer user
  await createTestUser(
    'test@customer.com',
    'test123',
    'Test Customer',
    'customer'
  )

  console.log('\n✅ All test users created!')
  console.log('\nYou can now use these credentials to test:')
  console.log('Business: test@business.com / test123')
  console.log('Customer: test@customer.com / test123')
}

// Run the script
createTestUsers()

