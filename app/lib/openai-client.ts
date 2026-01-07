import OpenAI from 'openai';

// Use OPENROUTER_API_KEY, fallback gracefully if missing
const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || '';

export const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://career-pilot-ai.vercel.app",
    "X-Title": "CareerPilot AI",
  }
}) : null;

export const isOpenAIConfigured = !!apiKey;
