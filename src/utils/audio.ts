let sharedAudioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

export async function initAudio() {
  if (!sharedAudioContext) {
    sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (sharedAudioContext.state === 'suspended') {
    await sharedAudioContext.resume();
  }
}

export function stopPCMAudio() {
  if (currentSource) {
    try {
      currentSource.stop();
      currentSource.disconnect();
    } catch (e) {
      // Ignore errors if already stopped
    }
    currentSource = null;
  }
}

/**
 * Plays raw PCM audio data from a base64 string.
 * Gemini TTS returns raw PCM with a sample rate of 24000Hz.
 */
export async function playPCMAudio(base64Data: string, sampleRate: number = 24000) {
  try {
    if (!sharedAudioContext) {
      sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Ensure context is running (needed for some browsers after user interaction)
    if (sharedAudioContext.state === 'suspended') {
      await sharedAudioContext.resume();
    }

    stopPCMAudio();
    
    // Decode base64 to binary
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Convert Int16 PCM to Float32
    const int16Buffer = new Int16Array(bytes.buffer);
    let float32Buffer = new Float32Array(int16Buffer.length);
    for (let i = 0; i < int16Buffer.length; i++) {
      float32Buffer[i] = int16Buffer[i] / 32768.0;
    }

    // Trim trailing silence
    const threshold = 0.05;
    let end = float32Buffer.length;
    while (end > 0 && Math.abs(float32Buffer[end - 1]) < threshold) {
      end--;
    }
    
    // Trim leading silence
    let start = 0;
    while (start < end && Math.abs(float32Buffer[start]) < threshold) {
      start++;
    }

    if (start > 0 || end < float32Buffer.length) {
      float32Buffer = float32Buffer.slice(start, end);
    }
    
    if (float32Buffer.length === 0) return null;

    const audioBuffer = sharedAudioContext.createBuffer(1, float32Buffer.length, sampleRate);
    audioBuffer.getChannelData(0).set(float32Buffer);
    
    const source = sharedAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(sharedAudioContext.destination);
    source.start();
    
    currentSource = source;
    return source;
  } catch (error) {
    console.error("Error playing PCM audio:", error);
    return null;
  }
}
