import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Create adapter factory for Prisma 7
const adapterFactory = new PrismaPg({ connectionString })

const books = [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0061120084',
    description: 'A novel about racial injustice in the Deep South, seen through the eyes of a young girl.',
    genre: 'Fiction',
    publisher: 'Harper Perennial',
    publishedYear: 1960,
    pageCount: 336,
    totalCopies: 3,
    availableCopies: 3,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg',
  },
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0451524935',
    description: 'A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.',
    genre: 'Science Fiction',
    publisher: 'Signet Classic',
    publishedYear: 1949,
    pageCount: 328,
    totalCopies: 4,
    availableCopies: 4,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '978-0141439518',
    description: 'A romantic novel following the emotional development of Elizabeth Bennet.',
    genre: 'Romance',
    publisher: 'Penguin Classics',
    publishedYear: 1813,
    pageCount: 432,
    totalCopies: 2,
    availableCopies: 2,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    description: 'A story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.',
    genre: 'Fiction',
    publisher: 'Scribner',
    publishedYear: 1925,
    pageCount: 180,
    totalCopies: 3,
    availableCopies: 3,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg',
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '978-0441172719',
    description: 'Set in the distant future, the novel tells the story of young Paul Atreides on the desert planet Arrakis.',
    genre: 'Science Fiction',
    publisher: 'Ace Books',
    publishedYear: 1965,
    pageCount: 688,
    totalCopies: 2,
    availableCopies: 2,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg',
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '978-0547928227',
    description: 'A fantasy novel about the adventures of hobbit Bilbo Baggins.',
    genre: 'Fantasy',
    publisher: 'Mariner Books',
    publishedYear: 1937,
    pageCount: 300,
    totalCopies: 3,
    availableCopies: 3,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '978-0062316097',
    description: 'A survey of the history of humankind from the evolution of archaic human species.',
    genre: 'Non-Fiction',
    publisher: 'Harper',
    publishedYear: 2015,
    pageCount: 464,
    totalCopies: 2,
    availableCopies: 2,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '978-0316769488',
    description: 'A story about teenage angst and alienation, narrated by Holden Caulfield.',
    genre: 'Fiction',
    publisher: 'Little, Brown and Company',
    publishedYear: 1951,
    pageCount: 277,
    totalCopies: 2,
    availableCopies: 2,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780316769488-L.jpg',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '978-0735211292',
    description: 'A guide to building good habits and breaking bad ones.',
    genre: 'Self-Help',
    publisher: 'Avery',
    publishedYear: 2018,
    pageCount: 320,
    totalCopies: 4,
    availableCopies: 4,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
  },
  {
    title: 'The Art of War',
    author: 'Sun Tzu',
    isbn: '978-1599869773',
    description: 'An ancient Chinese military treatise dating from the 5th century BC.',
    genre: 'Philosophy',
    publisher: 'Filiquarian',
    publishedYear: -500,
    pageCount: 68,
    totalCopies: 2,
    availableCopies: 2,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781599869773-L.jpg',
  },
]

async function main() {
  // Create PrismaClient with adapter factory (Prisma 7)
  const prisma = new PrismaClient({ adapter: adapterFactory })

  try {
    console.log('Seeding database...')

    // Seed books
    for (const book of books) {
      await prisma.book.upsert({
        where: { isbn: book.isbn },
        update: book,
        create: book,
      })
    }

    console.log(`Seeded ${books.length} books.`)

    // Seed admin user
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    const adminName = process.env.ADMIN_NAME || 'Admin User'
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (adminEmail && adminPassword && supabaseUrl && supabaseServiceKey) {
      try {
        // Check if user already exists in database
        let adminUser = await prisma.user.findUnique({
          where: { email: adminEmail },
        })

        if (!adminUser) {
          // Create user in Supabase Auth using Admin API
          const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
              autoRefreshToken: false,
              persistSession: false,
            },
          })

          const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: adminEmail,
            password: adminPassword,
            email_confirm: true, // Auto-confirm email
            user_metadata: {
              full_name: adminName,
            },
          })

          if (authError) {
            // If user already exists in Supabase, try to get them
            if (authError.message.includes('already registered')) {
              const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
              const foundUser = existingUser?.users.find((u) => u.email === adminEmail)
              
              if (foundUser) {
                // Create user in database with existing Supabase ID
                adminUser = await prisma.user.create({
                  data: {
                    id: foundUser.id,
                    email: adminEmail,
                    fullName: adminName,
                    role: 'admin',
                  },
                })
                console.log(`✓ Created admin user ${adminEmail} in database (existing Supabase user).`)
              } else {
                throw authError
              }
            } else {
              throw authError
            }
          } else if (authUser?.user) {
            // Create user in database with new Supabase ID
            adminUser = await prisma.user.create({
              data: {
                id: authUser.user.id,
                email: adminEmail,
                fullName: adminName,
                role: 'admin',
              },
            })
            console.log(`✓ Created admin user ${adminEmail} with password.`)
          }
        } else {
          // User exists, update to admin role
          await prisma.user.update({
            where: { email: adminEmail },
            data: { role: 'admin' },
          })
          console.log(`✓ Updated user ${adminEmail} to admin role.`)
        }
      } catch (error: any) {
        console.error(`✗ Failed to create admin user:`, error.message)
        console.log(`  Make sure SUPABASE_SERVICE_ROLE_KEY is set correctly in .env.local`)
      }
    } else {
      console.log('ℹ Admin user seeding skipped.')
      if (!adminEmail) {
        console.log('  Set ADMIN_EMAIL in .env.local to create an admin user.')
      }
      if (!adminPassword) {
        console.log('  Set ADMIN_PASSWORD in .env.local to create an admin user.')
      }
      if (!supabaseServiceKey) {
        console.log('  Set SUPABASE_SERVICE_ROLE_KEY in .env.local to create an admin user.')
      }
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
