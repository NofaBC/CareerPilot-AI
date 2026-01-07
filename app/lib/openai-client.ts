import OpenAI from 'openai';

// Lazy initialization - only create client when needed
let openaiInstance: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ OpenRouter API key not configured. Add OPENROUTER_API_KEY to Vercel environment variables.');
    return null;
  }

  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://career-pilot-ai.vercel.app",
        "X-Title": "CareerPilot AI",
      }
    });
  }
  
  return openaiInstance;
}

export function isOpenAIConfigured(): boolean {
  return !!(process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY);
}
