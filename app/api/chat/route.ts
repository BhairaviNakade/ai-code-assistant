import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // System prompt to guide the AI to provide code-related responses
  const systemPrompt = `
    You are an AI code assistant that helps developers write code.
    When asked to create something, provide clear, well-commented code examples.
    Explain your code and provide context on how to use it.
    Focus on modern best practices and clean code.
  `

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: systemPrompt,
  })

  return result.toDataStreamResponse()
}

