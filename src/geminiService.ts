import { GoogleGenAI, Chat } from "@google/genai";
import { Features, Scores } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
let chat: Chat | null = null;

export const startChatSession = async (features: Features, scores: Scores): Promise<string> => {
    if (!process.env.API_KEY) {
        return "AI co-pilot unavailable: API key not configured.";
    }

    const systemInstruction = `You are a world-class security analyst co-pilot named Sentinel AI. You are helping a human analyst investigate a real-time security alert. Your tone is concise, expert, and helpful. Do not use conversational filler. Provide direct answers based on the data provided.

    The user's normal behavior profile is as follows:
    - Normal Typing Speed: 6-14 chars/sec
    - Normal Error Rate: < 1 backspace/event
    - Normal Mouse Speed: 300-900 px/sec
    - Normal Mouse Hesitation: < 3 stops/event

    Start the conversation by providing a 1-2 sentence summary of the initial anomaly, then state "How can I help you investigate?".
    `;

    const initialContext = `
      INITIAL ANOMALY CONTEXT:
      A potential security anomaly was detected with a fused risk score of ${Math.round(scores.fused * 100)}%.

      Detected Features at time of alert:
      - Typing Speed: ${features.typingSpeed.toFixed(2)} chars/sec
      - Error Rate: ${features.errorRate.toFixed(2)} backspaces/event
      - Swipe Intensity: ${features.swipeIntensity.toFixed(2)}
      - Mouse Speed: ${features.mouseSpeed.toFixed(2)} px/sec
      - Mouse Hesitation: ${features.mouseHesitation.toFixed(2)} stops/event
      - Session Time: ${features.sessionTime}
      - Location Risk: ${features.locationRisk}
    `;

    try {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction,
            },
        });

        const response = await chat.sendMessage({ message: initialContext });
        return response.text;
    } catch (error) {
        console.error("Error starting Gemini chat session:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return `AI co-pilot initialization failed. Please check your network connection or API key. Details: ${errorMessage}`;
    }
};

export const sendMessage = async (message: string): Promise<string> => {
    if (!chat) {
        return "Chat session not initialized.";
    }
    if (!process.env.API_KEY) {
        return "AI co-pilot unavailable: API key not configured.";
    }
    try {
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        return "Error communicating with AI co-pilot. Please check your connection and try again.";
    }
};