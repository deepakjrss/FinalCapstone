const OpenAI = require("openai");

const API_KEY = process.env.OPENAI_API_KEY;
let client = null;

if (API_KEY) {
  client = new OpenAI({ apiKey: API_KEY });
} else {
  console.warn('⚠️ OPENAI_API_KEY is missing. AI calls will use fallback mode.');
}

const FALLBACK_REPLY = "🌿 Hello! I'm your Eco Assistant!";

const generateAIResponse = async (message) => {
  if (!client) {
    return FALLBACK_REPLY;
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an eco-friendly assistant helping students." },
        { role: "user", content: message }
      ],
      max_tokens: 200,
      temperature: 0.8,
      top_p: 0.95,
    });

    const reply = response?.choices?.[0]?.message?.content;

    if (!reply) {
      console.warn('⚠️ OpenAI response missing content; using fallback.');
      return FALLBACK_REPLY;
    }

    return reply;
  } catch (error) {
    console.error("🔥 OPENAI ERROR:", error);
    return FALLBACK_REPLY;
  }
};

const checkOpenAIHealth = async () => {
  if (!client) {
    return { healthy: false, reason: 'OPENAI_API_KEY missing' };
  }

  try {
    await client.models.retrieve({ model: 'gpt-4o-mini' });
    return { healthy: true, model: 'gpt-4o-mini' };
  } catch (error) {
    console.error('🔍 OpenAI health check failed:', error?.message || error);
    return { healthy: false, reason: (error?.message || 'unknown error') };
  }
};

module.exports = {
  generateAIResponse,
  checkOpenAIHealth,
  FALLBACK_REPLY,
};