'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  ArrowLeftRight,
  Shield,
  Sparkles,
} from 'lucide-react'
import { useUser } from '@/hooks/use-user'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/books', label: 'Books', icon: BookOpen },
  { href: '/borrow', label: 'Borrowing', icon: ArrowLeftRight },
]

const adminItems = [
  { href: '/admin', label: 'Admin Panel', icon: Shield },
]

export function Sidebar() {
  const pathname = usePathname()
  const { profile } = useUser()

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-muted/20 p-4 gap-2 overflow-y-auto">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
              isActive(item.href)
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      {profile?.role === 'admin' && (
        <>
          <div className="mt-4 mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Administration
          </div>
          <nav className="flex flex-col gap-1">
            {adminItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                    : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </>
      )}

      <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 border border-primary/10">
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-semibold text-primary">AI-Powered</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
          Smart search and book recommendations powered by AI.
        </p>
      </div>
    </aside>
  )
}
