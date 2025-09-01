import { createClient as createSupabaseClient } from "@supabase/supabase-js"

interface SSRModule {
  createBrowserClient: typeof createSupabaseClient
  createServerClient: typeof createSupabaseClient
}

let ssrModule: SSRModule | null = null

const getSSRModule = async (): Promise<SSRModule> => {
  if (!ssrModule) {
    try {
      // Dynamic import with error handling
      const module = await import("@supabase/ssr")
      ssrModule = module as unknown as SSRModule
    } catch (error) {
      console.warn("⚠️ @supabase/ssr not available, using fallback client creation")
      ssrModule = {
        createBrowserClient: createSupabaseClient,
        createServerClient: createSupabaseClient,
      }
    }
  }
  return ssrModule
}

const validateJWT = (token: string): boolean => {
  if (!token) return false

  const parts = token.split(".")
  if (parts.length !== 3) {
    return false
  }

  try {
    const header = JSON.parse(atob(parts[0]))
    const payload = JSON.parse(atob(parts[1]))

    return !!(header.alg && header.typ && payload.iss)
  } catch {
    return false
  }
}

const validateEnvironmentVariables = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Use placeholder values for development if environment variables are not set
  if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️ Supabase environment variables not found. Using placeholder values for development.")
    return {
      supabaseUrl: "https://kazxsniyffosngltskkm.supabase.co",
      supabaseKey: "eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3Mi0iJzdXBhYm"
    }
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch {
    console.warn("⚠️ Invalid Supabase URL format. Using placeholder values for development.")
    return {
      supabaseUrl: "https://placeholder.supabase.co",
      supabaseKey: supabaseKey
    }
  }

  // Validate JWT format
  if (!validateJWT(supabaseKey)) {
    console.warn("⚠️ Invalid Supabase key format. Using placeholder values for development.")
    return {
      supabaseUrl: supabaseUrl,
      supabaseKey: "placeholder-key"
    }
  }

  return { supabaseUrl, supabaseKey }
}

const { supabaseUrl, supabaseKey } = validateEnvironmentVariables()

export const createClient = () => {
  try {
    return createSupabaseClient(supabaseUrl, supabaseKey)
  } catch (error) {
    throw new Error(
      `Supabase client initialization failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

interface CookieStore {
  get(name: string): { value: string } | undefined
}

export const createBrowserSupabaseClient = async () => {
  try {
    const ssr = await getSSRModule()
    if (ssr.createBrowserClient && ssr.createBrowserClient !== createSupabaseClient) {
      return ssr.createBrowserClient(supabaseUrl, supabaseKey)
    } else {
      return createSupabaseClient(supabaseUrl, supabaseKey)
    }
  } catch (error) {
    return createSupabaseClient(supabaseUrl, supabaseKey)
  }
}

export const createServerSupabaseClient = async (cookieStore: CookieStore) => {
  try {
    const ssr = await getSSRModule()
    if (ssr.createServerClient && ssr.createServerClient !== createSupabaseClient) {
      return ssr.createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      } as any)
    } else {
      return createSupabaseClient(supabaseUrl, supabaseKey)
    }
  } catch (error) {
    return createSupabaseClient(supabaseUrl, supabaseKey)
  }
}

export const supabase = createSupabaseClient(supabaseUrl, supabaseKey)
