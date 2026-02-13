import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, interviewType, targetRole, userProfile } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not configured');
      return NextResponse.json({ 
        error: 'Interview coach not configured',
        response: null
      }, { status: 500 });
    }

    // Build system prompt based on interview type
    let systemPrompt = `You are an expert interview coach conducting a ${interviewType || 'general'} interview for a ${targetRole || 'professional'} position. 

Your role:
- Ask relevant, thoughtful interview questions
- Provide constructive feedback on answers
- Be encouraging but honest
- Ask follow-up questions to dig deeper
- Maintain a professional but friendly tone

Interview style: ${interviewType === 'behavioral' ? 'Ask STAR method questions about past experiences' : interviewType === 'technical' ? 'Ask technical questions relevant to the role' : 'Ask a mix of questions about experience, skills, and motivation'}

Keep responses concise and focused. After 5-7 questions, offer to wrap up and provide overall feedback.`;

    if (userProfile) {
      systemPrompt += `\n\nCandidate background: ${userProfile}`;
    }

    console.log('🤖 Generating interview response with OpenAI');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 'I apologize, I encountered an error. Could you please repeat that?';
    
    console.log('✅ Interview response generated');

    return NextResponse.json({ response: assistantMessage });
  } catch (error: any) {
    console.error('❌ /api/interview-coach error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate response',
      details: error.message
    }, { status: 500 });
  }
}
