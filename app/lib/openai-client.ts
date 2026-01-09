// app/lib/openai-client.ts
import OpenAI from 'openai';

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  // Lazy initialization - only create client when explicitly called
  if (!client) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ OpenRouter API key not configured. Add OPENROUTER_API_KEY to Vercel environment variables.');
      return null;
    }

    client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      defaultHeaders: {
        "HTTP-Referer": "https://career-pilot-ai-five.vercel.app",
        "X-Title": "CareerPilot AI",
      },
    });
  }
  
  return client;
}

export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENROUTER_API_KEY;
}
