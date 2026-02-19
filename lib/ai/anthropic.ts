import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY;

export const anthropic = apiKey ? new Anthropic({
  apiKey,
}) : null;

export async function enhanceContent(content: string, context: string): Promise<string> {
  if (!anthropic) {
    throw new Error('AI capabilities are not configured (Missing API Key)');
  }

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 2048,
      temperature: 0.7,
      system: "You are BrainStack AI, an expert operational consultant. Your goal is to improve, refine, and professionalize business content.",
      messages: [{
        role: 'user',
        content: `Please enhance the following content.
        
        Context/Goal: ${context}
        
        Content to Enhance:
        """
        ${content}
        """
        
        Instructions:
        1. Improve clarity, tone, and professionalism.
        2. Fix any grammar or structural issues.
        3. Make it more persuasive or impactful where appropriate.
        4. Return ONLY the enhanced content. Do not include conversational filler.`
      }],
    });

    if (msg.content[0].type === 'text') {
      return msg.content[0].text;
    }
    return content;
  } catch (error) {
    console.error('Anthropic API Error:', error);
    throw new Error('Failed to communicate with AI service');
  }
}
