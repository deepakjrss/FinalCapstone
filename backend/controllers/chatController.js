// openai v4 client initialization
const OpenAI = require('openai');

// ensure key present
if (!process.env.OPENAI_API_KEY) {
  console.warn('WARNING: OPENAI_API_KEY is not set. /api/chat will fail until configured.');
}

// initialize client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// system prompt constant
const SYSTEM_INSTRUCTION =
  "You are the Forest Guardian AI of EcoVerse.\n" +
  "Explain environmental concepts simply for middle school students.\n" +
  "Encourage eco-friendly behavior.\n" +
  "Keep answers short and educational.";

/**
 * POST /api/chat
 * Body: { message: string }
 * Protected - verifyToken middleware must be applied on route
 */
const chatWithGuardian = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid "message" field is required in the request body.'
      });
    }

    // call OpenAI chat completion (v4 syntax)
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        { role: 'user', content: message }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    const aiReply =
      response?.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't generate a response.";

    res.json({ reply: aiReply });
  } catch (error) {
    console.error('Chat controller error:', error);
    // bubble up errors from openai
    if (error.response && error.response.data) {
      return res.status(error.response.status || 500).json({
        success: false,
        message: error.response.data.error?.message || 'AI service error'
      });
    }

    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while processing the chat request.'
    });
  }
};

module.exports = { chatWithGuardian };
