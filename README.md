# LibraryMS - Library Management System

A modern, full-stack library management system built with Next.js, Supabase, Prisma, and Claude AI. Features include book management, check-in/check-out tracking, AI-powered search, smart recommendations, and role-based access control.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma 7
- **Auth:** Supabase Auth
- **AI:** Anthropic Claude API (Haiku 4.5)
- **UI:** shadcn/ui, Tailwind CSS, Lucide Icons
- **State:** TanStack React Query

## Features

- **Book Management** - Full CRUD with title, author, ISBN, genre, cover images, and inventory tracking
- **Check-in / Check-out** - Borrow and return books with 14-day loan periods and overdue detection
- **AI-Powered Search** - Natural language queries like "sci-fi books published after 2000"
- **AI Recommendations** - Personalized suggestions based on borrowing history
- **AI Autofill** - Auto-populate book metadata when adding new books
- **Role-Based Access** - Three roles: admin, librarian, member
- **Admin Panel** - User management, system statistics, and role oversight
- **Responsive UI** - Blue-themed modern design with dark mode support

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- An [Anthropic API key](https://console.anthropic.com) for AI features

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# ─── Supabase ───────────────────────────────────────────────
# Found in: Supabase Dashboard → Settings → API

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# The URL of your Supabase project.

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
# The public anonymous key. Safe to expose in the browser.

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
# The secret service role key. Used server-side only for admin
# operations like verifying users during registration and seeding.
# NEVER expose this in client-side code.

# ─── Database ───────────────────────────────────────────────
# Found in: Supabase Dashboard → Settings → Database → Connection string

DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
# The pooled connection string (port 6543). Used by Prisma for
# queries at runtime. Use the "Transaction" mode connection string.

DIRECT_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
# The direct connection string (port 5432). Used by Prisma for
# migrations and schema pushes. Use the "Session" mode connection string.

# ─── Anthropic AI ───────────────────────────────────────────

ANTHROPIC_API_KEY=sk-ant-...
# Your Anthropic API key. Powers AI search, recommendations,
# and book autofill features.

# ─── Admin Seed (optional) ──────────────────────────────────
# These are only used by the seed script (npm run db:seed).
# If set, the seed script will create an admin user in both
# Supabase Auth and the database.

ADMIN_EMAIL=admin@example.com
# Email for the admin account.

ADMIN_PASSWORD=your-secure-password
# Password for the admin account (min 6 characters).

ADMIN_NAME=Admin User
# Display name for the admin account. Defaults to "Admin User".
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the template above into `.env.local` and fill in your values.

### 3. Push the database schema

This creates the tables in your Supabase PostgreSQL database:

```bash
npm run db:push
```

### 4. Seed the database

This populates the database with 10 sample books and optionally creates an admin user:

```bash
npm run db:seed
```

**Important:** To get an admin user, make sure `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `SUPABASE_SERVICE_ROLE_KEY` are all set in `.env.local` before running the seed. The seed script will:

1. Create the user in Supabase Auth (with email auto-confirmed)
2. Create the corresponding user record in the database with the `admin` role
3. If the Supabase Auth user already exists, it will link the existing account

After seeding, you can log in with the admin email/password. Admin users can add/edit/delete books and access the Admin Panel.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run db:push` | Push Prisma schema to the database |
| `npm run db:seed` | Seed books and admin user |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:generate` | Regenerate Prisma client |

## User Roles

| Role | Permissions |
|---|---|
| **admin** | Full access: manage books, view all users, admin panel, borrow/return |
| **librarian** | Manage books (add/edit/delete), borrow/return |
| **member** | Browse books, borrow/return, view personal history |

New users who sign up are assigned the `member` role by default. To promote a user to admin, update their role directly in Prisma Studio (`npm run db:studio`) or via the database.

## Deployment

The app is ready to deploy on [Vercel](https://vercel.com):

1. Push your code to a Git repository
2. Import the project in Vercel
3. Add all environment variables from `.env.local` to the Vercel project settings
4. Deploy

Make sure to set the environment variables in the Vercel dashboard, not just locally.
