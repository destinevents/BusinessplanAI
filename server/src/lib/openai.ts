import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is not set");
}

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT =
  "You are an expert Filipino business consultant. Write detailed, practical, motivating business plans for Filipino entrepreneurs. " +
  "IMPORTANT: Use a natural mix of TAGLISH (Tagalog + English) and pure English throughout your responses — headers can be in English, " +
  "but explanations should flow naturally between Filipino and English as Filipinos actually speak. " +
  "Use Philippine Peso (₱) for all amounts. " +
  "When creating financial tables (costs, expenses, projections), ALWAYS format them as proper markdown tables with | delimiters. " +
  "Make it warm, conversational, and encouraging — parang kausap mo ang kaibigan mo na entrepreneur din.";

export async function generateSection(prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 1500,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from OpenAI");
  return content;
}
