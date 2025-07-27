import { CaptionResult } from "@shared/schema";

interface HuggingFaceResponse {
  generated_text: string;
}

export async function generateCaptions(
  description: string,
  tones: string[],
  imageBase64?: string
): Promise<CaptionResult[]> {
  try {
    const results: CaptionResult[] = [];

    for (const tone of tones) {
      const prompt = createPromptForTone(description, tone);
      
      // Use Hugging Face's free inference API
      const response = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_length: 100,
              temperature: 0.8,
              do_sample: true,
            },
          }),
        }
      );

      if (!response.ok) {
        // Fallback to local generation if API fails
        const fallbackCaption = generateFallbackCaption(description, tone);
        results.push({
          tone,
          text: fallbackCaption.text,
          characterCount: fallbackCaption.text.length,
          suggestedHashtags: fallbackCaption.hashtags
        });
        continue;
      }

      const data: HuggingFaceResponse[] = await response.json();
      const generatedText = data[0]?.generated_text || "";
      
      // Extract caption from generated text and clean it up
      const caption = cleanGeneratedCaption(generatedText, tone);
      const hashtags = generateHashtags(description, tone);
      
      results.push({
        tone,
        text: caption,
        characterCount: caption.length,
        suggestedHashtags: hashtags
      });
    }

    return results;
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    
    // Fallback to local generation if everything fails
    const fallbackResults = tones.map(tone => {
      const fallback = generateFallbackCaption(description, tone);
      return {
        tone,
        text: fallback.text,
        characterCount: fallback.text.length,
        suggestedHashtags: fallback.hashtags
      };
    });
    
    return fallbackResults;
  }
}

function generateFallbackCaption(description: string, tone: string): { text: string; hashtags: string[] } {
  const templates = {
    witty: [
      "When {description} hits different 📸✨",
      "Plot twist: {description} wasn't even planned but here we are ✨",
      "That moment when {description} becomes the main character 🎬",
      "{description} said 'hold my coffee' and delivered this masterpiece ☕",
      "POV: {description} is serving looks and we're here for it 💫"
    ],
    poetic: [
      "In the gentle embrace of {description}, beauty whispers its secrets",
      "{description} paints stories across the canvas of time",
      "Where {description} meets the soul, magic unfolds in quiet moments",
      "Through {description}, light dances with shadow in perfect harmony",
      "{description} reminds us that wonder lives in the simplest moments"
    ],
    professional: [
      "Capturing the essence of {description} with precision and artistry",
      "{description} exemplifies our commitment to quality and excellence",
      "Strategic storytelling through {description} that resonates with our audience",
      "Professional documentation of {description} that elevates the narrative",
      "{description} showcases the intersection of creativity and purpose"
    ],
    casual: [
      "Just vibing with {description} and loving every second of it 🌟",
      "{description} hitting all the right notes today ✌️",
      "Real talk: {description} is exactly what I needed right now 💙",
      "Sometimes {description} just speaks to your soul, you know? 😊",
      "{description} bringing those good vibes we all need 🌈"
    ]
  };

  const toneTemplates = templates[tone as keyof typeof templates] || templates.casual;
  const randomTemplate = toneTemplates[Math.floor(Math.random() * toneTemplates.length)];
  
  // Extract key words from description for replacement
  const shortDesc = extractKeyWords(description);
  const caption = randomTemplate.replace('{description}', shortDesc);
  
  return {
    text: caption,
    hashtags: generateHashtags(description, tone)
  };
}

function extractKeyWords(description: string): string {
  // Extract meaningful words and create a shorter version
  const words = description.toLowerCase().split(' ');
  const importantWords = words.filter(word => 
    word.length > 3 && 
    !['with', 'and', 'the', 'that', 'this', 'very', 'really', 'quite'].includes(word)
  );
  
  return importantWords.slice(0, 3).join(' ') || 'this moment';
}

function cleanGeneratedCaption(generatedText: string, tone: string): string {
  // Clean and format the generated text
  let caption = generatedText.replace(/^.*?:/, '').trim(); // Remove prompt prefix
  caption = caption.split('\n')[0]; // Take first line only
  caption = caption.replace(/['"]/g, ''); // Remove quotes
  
  // Ensure it's not too long
  if (caption.length > 200) {
    caption = caption.substring(0, 197) + '...';
  }
  
  // Add tone-appropriate emojis
  const emojiMap = {
    witty: ['😎', '✨', '📸', '🎬', '💫'],
    poetic: ['🌙', '✨', '🌟', '💫', '🌸'],
    professional: ['📈', '💼', '🎯', '⭐', '🏆'],
    casual: ['😊', '🌟', '💙', '✌️', '🌈']
  };
  
  const emojis = emojiMap[tone as keyof typeof emojiMap] || emojiMap.casual;
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  
  if (!caption.includes('📸') && !caption.includes('✨') && !caption.includes('😊')) {
    caption += ` ${randomEmoji}`;
  }
  
  return caption || generateFallbackCaption('this moment', tone).text;
}

function generateHashtags(description: string, tone: string): string[] {
  const baseHashtags = ['content', 'creative', 'inspiration'];
  
  const toneHashtags = {
    witty: ['funny', 'clever', 'witty', 'humor'],
    poetic: ['poetry', 'artistic', 'beauty', 'mindful'],
    professional: ['business', 'professional', 'quality', 'brand'],
    casual: ['authentic', 'vibes', 'lifestyle', 'real']
  };
  
  // Extract context-based hashtags from description
  const contextHashtags = [];
  const desc = description.toLowerCase();
  
  if (desc.includes('sunset') || desc.includes('golden')) contextHashtags.push('sunset', 'golden');
  if (desc.includes('coffee') || desc.includes('morning')) contextHashtags.push('coffee', 'morning');
  if (desc.includes('nature') || desc.includes('mountain')) contextHashtags.push('nature', 'landscape');
  if (desc.includes('food') || desc.includes('restaurant')) contextHashtags.push('food', 'foodie');
  if (desc.includes('travel') || desc.includes('city')) contextHashtags.push('travel', 'explore');
  if (desc.includes('photo') || desc.includes('camera')) contextHashtags.push('photography', 'photooftheday');
  
  // If no context found, add generic ones
  if (contextHashtags.length === 0) {
    contextHashtags.push('moment', 'life', 'daily');
  }
  
  const selectedToneHashtags = toneHashtags[tone as keyof typeof toneHashtags] || toneHashtags.casual;
  
  return [...baseHashtags, ...selectedToneHashtags.slice(0, 2), ...contextHashtags.slice(0, 3)].slice(0, 8);
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
