import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

export async function getDIYGuidance(taskDescription) {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a practical DIY home repair assistant for rural homeowners.
When given a task, respond with:
1. A brief overview (1-2 sentences)
2. A "Tools & Materials" section listing what's needed
3. A numbered "Step-by-Step Instructions" section with clear, actionable steps
4. A "Safety Notes" section if relevant
5. A "When to Call a Pro" note if the task might exceed DIY ability

Keep language simple and practical. Assume the user may not have easy access to hardware stores.`,
      },
      {
        role: 'user',
        content: taskDescription,
      },
    ],
  })

  return response.choices[0].message.content
}

export function getYouTubeSearchUrl(query) {
  const encoded = encodeURIComponent(query + ' DIY how to')
  return `https://www.youtube.com/results?search_query=${encoded}`
}

export function getYouTubeEmbedSearchUrl(query) {
  // YouTube doesn't support embedding search results directly,
  // so we use a search-results iframe via a curated approach:
  // embed the first result by constructing a search URL shown in an iframe wrapper
  const encoded = encodeURIComponent(query + ' DIY tutorial how to')
  return `https://www.youtube.com/results?search_query=${encoded}`
}
