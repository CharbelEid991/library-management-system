import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * Extract JSON from a model response that may be wrapped in markdown code fences.
 */
function extractJSON(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (match) return match[1].trim()
  return text.trim()
}

export async function getBookRecommendations(
  userHistory: { title: string; author: string; genre: string }[],
  availableBooks: { title: string; author: string; genre: string }[]
) {
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a library recommendation engine. Based on the user's reading history, recommend books from the available collection.

User's reading history:
${userHistory.map((b) => `- "${b.title}" by ${b.author} (${b.genre})`).join('\n')}

Available books in our library:
${availableBooks.map((b) => `- "${b.title}" by ${b.author} (${b.genre})`).join('\n')}

Return a JSON array of recommendations with this format:
[{"title": "...", "author": "...", "reason": "...", "matchScore": 0.0-1.0}]

Return ONLY valid JSON, no other text. Do NOT wrap in code fences.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type === 'text') {
    return JSON.parse(extractJSON(content.text))
  }
  return []
}

export async function parseNaturalLanguageSearch(query: string) {
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Parse this natural language library search query into structured filters.

Query: "${query}"

Return a JSON object with these optional fields:
{
  "interpretedQuery": "human-readable interpretation",
  "search": "text search term",
  "genre": "genre filter if mentioned",
  "author": "author filter if mentioned",
  "available": true/false if availability mentioned,
  "sort": "title|author|year|newest if sort preference mentioned"
}

Return ONLY valid JSON, no other text. Do NOT wrap in code fences.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type === 'text') {
    return JSON.parse(extractJSON(content.text))
  }
  return { search: query, interpretedQuery: query }
}

export async function autofillBookDetails(partialInfo: string) {
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Given this partial book information, fill in the complete details.

Info: "${partialInfo}"

Return a JSON object:
{
  "title": "...",
  "author": "...",
  "isbn": "...",
  "description": "brief description",
  "genre": "...",
  "publisher": "...",
  "published_year": 0,
  "page_count": 0
}

Return ONLY valid JSON, no other text. Do NOT wrap in code fences. Use your best knowledge. If unsure about a field, use an empty string or 0.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type === 'text') {
    return JSON.parse(extractJSON(content.text))
  }
  return null
}
