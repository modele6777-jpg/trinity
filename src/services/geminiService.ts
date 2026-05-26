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

async function callPoe(system: string, userMsg: string, luciel: boolean = false) {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, prompt: userMsg, luciel }),
  });

  const result = await response.json() as { text?: string; error?: string };
  if (!response.ok || !result.text) {
    throw new Error(result.error || "POE_REQUEST_FAILED");
  }

  return result.text;
}

export async function callLuciel(system: string, userMsg: string) {
  return callPoe(system, userMsg, true);
}

export async function callGemini(system: string, userMsg: string, stream: boolean = false, onChunk?: (text: string) => void, _image?: { data: string, mimeType: string }) {
  if (isQuotaBlocked) throw new Error("QUOTA_EXCEEDED");
  
  try {
    const text = await callPoe(system, userMsg);
    if (stream && onChunk) onChunk(text);
    return text;
  } catch (e: any) {
    const errorMsg = e?.message || String(e);
    if (errorMsg.includes("429") || errorMsg.includes("quota")) {
      console.error(`Poe Quota Exceeded (429).`);
      blockQuota();
      throw new Error("QUOTA_EXCEEDED");
    }
    throw e;
  }
}
