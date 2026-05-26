import { GoogleGenAI, Modality } from "@google/genai";

// Safe access to environment variables in both Node and Browser (via Vite define)
const getApiKey = () => {
  try {
    return (process as any).env.GEMINI_API_KEY || "";
  } catch (e) {
    return "";
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

let isQuotaBlocked = false;
let quotaBlockTimer: any = null;

const blockQuota = () => {
  isQuotaBlocked = true;
  if (quotaBlockTimer) clearTimeout(quotaBlockTimer);
  quotaBlockTimer = setTimeout(() => {
    isQuotaBlocked = false;
  }, 60000); // Block for 1 minute
};

export const checkQuota = () => isQuotaBlocked;

export async function generateSpeech(text: string, voice: string = 'Kore') {
  if (isQuotaBlocked) return null;
  
  const maxRetries = 1;
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const callPromise = ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice },
            },
          },
        },
      });

      const timeoutPromise = new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error("TTS_TIMEOUT")), 60000)
      );

      const response: any = await Promise.race([callPromise, timeoutPromise]);
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      return base64Audio || null;
    } catch (e: any) {
      const errorMsg = e?.message || String(e);
      if (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("quota")) {
        console.error("TTS Quota Exceeded (429)");
        blockQuota();
        throw new Error("QUOTA_EXCEEDED");
      }
      
      console.error(`TTS Attempt ${attempt + 1} failed:`, e);
      lastError = e;
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  return null;
}

export async function callGemini(system: string, userMsg: string, stream: boolean = false, onChunk?: (text: string) => void, image?: { data: string, mimeType: string }) {
  if (isQuotaBlocked) throw new Error("QUOTA_EXCEEDED");
  
  try {
    const contents: any = [{ parts: [{ text: userMsg }] }];
    if (image) {
      contents[0].parts.push({ inlineData: image });
    }

    if (stream) {
      const response = await ai.models.generateContentStream({
        model: "gemini-1.5-flash",
        contents,
        config: { 
          systemInstruction: system
        }
      });
      let fullText = "";
      for await (const chunk of response) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          if (onChunk) onChunk(fullText);
        }
      }
      return fullText;
    } else {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents,
        config: { 
          systemInstruction: system
        }
      });
      return response.text || "";
    }
  } catch (e: any) {
    const errorMsg = e?.message || String(e);
    if (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("quota")) {
      console.error(`Gemini Quota Exceeded (429).`);
      blockQuota();
      throw new Error("QUOTA_EXCEEDED");
    }
    throw e;
  }
}
