import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'
import { Sparkles, ArrowRight, Users, Search, BookOpen } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="w-full max-w-7xl mx-auto px-4">
          <section className="py-16 md:py-24 text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by AI
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-blue-500 to-blue-400 bg-clip-text text-transparent">
                Modern Library
              </span>
              <br />
              Management System
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Manage your library collection with AI-powered search, smart recommendations,
              and seamless book tracking.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <Button asChild size="lg" className="shadow-lg shadow-primary/25 px-8">
                <Link href="/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </section>

          <section className="py-12 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group text-center space-y-4 p-8 rounded-2xl border bg-card hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-center">
                  <div className="rounded-2xl bg-blue-500/10 p-4 group-hover:bg-blue-500/15 transition-colors">
                    <Search className="h-7 w-7 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold">AI-Powered Search</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Search using natural language. Find books by describing what you want to read.
                </p>
              </div>
              <div className="group text-center space-y-4 p-8 rounded-2xl border bg-card hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-center">
                  <div className="rounded-2xl bg-violet-500/10 p-4 group-hover:bg-violet-500/15 transition-colors">
                    <Sparkles className="h-7 w-7 text-violet-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Smart Recommendations</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Get personalized book suggestions based on your reading history.
                </p>
              </div>
              <div className="group text-center space-y-4 p-8 rounded-2xl border bg-card hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-center">
                  <div className="rounded-2xl bg-emerald-500/10 p-4 group-hover:bg-emerald-500/15 transition-colors">
                    <BookOpen className="h-7 w-7 text-emerald-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Easy Management</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Track checkouts, returns, and manage your entire catalog effortlessly.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t py-6 mt-auto bg-muted/30">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          LibraryMS - Built with Next.js, Supabase, and Claude AI
        </div>
      </footer>
    </div>
  )
}
