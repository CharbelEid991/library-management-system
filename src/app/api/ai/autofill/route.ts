import { NextRequest, NextResponse } from 'next/server'
import { autofillBookDetails } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Missing required field: query' },
        { status: 400 }
      )
    }

    const bookDetails = await autofillBookDetails(query)

    return NextResponse.json(bookDetails)
  } catch (error) {
    console.error('Failed to autofill book details:', error)
    return NextResponse.json(
      { error: 'Failed to autofill book details' },
      { status: 500 }
    )
  }
}
