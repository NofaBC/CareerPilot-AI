import OpenAI from 'openai';

// Use OPENROUTER_API_KEY directly (more explicit)
const apiKey = process.env.OPENROUTER_API_KEY;

export const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://career-pilot-ai.vercel.app", // Your site URL
    "X-Title": "CareerPilot AI", // App name for OpenRouter analytics
  }
});

export const isOpenAIConfigured = !!apiKey;
