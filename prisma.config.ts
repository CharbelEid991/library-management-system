import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'
import { resolve } from 'path'

// Load .env.local first (Next.js convention), then fall back to .env
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

// For migrations, use DIRECT_URL if available (Supabase direct connection)
// Otherwise, remove pgbouncer from DATABASE_URL for direct connection
let databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL or DIRECT_URL environment variable is not set. Please ensure it is set in .env.local or .env file'
  )
}

// If using DATABASE_URL with pgbouncer, remove it and add SSL for direct connection (required for migrations)
if (databaseUrl.includes('pgbouncer=true') && !process.env.DIRECT_URL) {
  // Remove pgbouncer parameter
  databaseUrl = databaseUrl.replace(/[?&]pgbouncer=true/, '').replace(/\?$/, '')
  
  // Add SSL parameters for Supabase direct connection (required for direct connections)
  // Use string manipulation instead of URL() to handle special characters in passwords
  const separator = databaseUrl.includes('?') ? '&' : '?'
  databaseUrl = `${databaseUrl}${separator}sslmode=require`
  
  // Debug: log the modified connection string (mask password)
  console.log('Using direct connection URL (pgbouncer removed, SSL added)')
}

// Debug: show which URL is being used (mask password for security)
const maskedUrl = databaseUrl.replace(/:([^:@]+)@/, ':****@')
console.log('Database URL:', maskedUrl)

export default defineConfig({
  datasource: {
    url: databaseUrl,
  },
})

