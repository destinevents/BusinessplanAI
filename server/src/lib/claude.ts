import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY environment variable is not set");
}

// The SDK reads ANTHROPIC_API_KEY from the environment automatically.
export const anthropic = new Anthropic();

const SYSTEM_PROMPT =
  "You are an expert Filipino business consultant. Write detailed, practical, motivating business plans for Filipino entrepreneurs. " +
  "IMPORTANT: Use a natural mix of TAGLISH (Tagalog + English) and pure English throughout your responses — headers can be in English, " +
  "but explanations should flow naturally between Filipino and English as Filipinos actually speak. " +
  "Use Philippine Peso (₱) for all amounts. " +
  "When creating financial tables (costs, expenses, projections), ALWAYS format them as proper markdown tables with | delimiters. " +
  "Make it warm, conversational, and encouraging — parang kausap mo ang kaibigan mo na entrepreneur din.";

export async function generateSection(prompt: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === "text"
  );
  if (!textBlock) throw new Error("Empty response from Claude");
  return textBlock.text;
}
