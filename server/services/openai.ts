import OpenAI from "openai";
import { CaptionResult } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function generateCaptions(
  description: string,
  tones: string[],
  imageBase64?: string
): Promise<CaptionResult[]> {
  try {
    const results: CaptionResult[] = [];

    for (const tone of tones) {
      const prompt = createPromptForTone(description, tone);
      
      const messages: any[] = [
        {
          role: "system",
          content: "You are an expert social media caption writer. Generate engaging, platform-ready captions based on the description and tone provided. Respond with JSON in this format: { 'caption': string, 'hashtags': string[] }"
        },
        {
          role: "user",
          content: imageBase64 ? [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
            }
          ] : prompt
        }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        response_format: { type: "json_object" },
        max_tokens: 300,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      results.push({
        tone,
        text: result.caption || "Unable to generate caption",
        characterCount: (result.caption || "").length,
        suggestedHashtags: result.hashtags || []
      });
    }

    return results;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate captions. Please check your API key and try again.");
  }
}

function createPromptForTone(description: string, tone: string): string {
  const toneInstructions = {
    witty: "Create a witty, clever caption with humor and personality. Keep it engaging and shareable.",
    poetic: "Write a poetic, artistic caption with beautiful imagery and metaphors. Make it inspiring and thoughtful.",
    professional: "Generate a professional, polished caption suitable for business or formal contexts. Keep it sophisticated yet approachable.",
    casual: "Create a casual, friendly caption that feels natural and conversational. Make it relatable and authentic."
  };

  const instruction = toneInstructions[tone.toLowerCase() as keyof typeof toneInstructions] || 
                    "Create an engaging caption that matches the requested tone.";

  return `${instruction}

Image/Scene Description: ${description}

Generate a caption that:
- Matches the ${tone} tone perfectly
- Is optimized for social media platforms
- Includes 3-5 relevant hashtags
- Is between 50-200 characters
- Captures the essence of the described scene

Please respond with JSON containing 'caption' and 'hashtags' fields.`;
}
