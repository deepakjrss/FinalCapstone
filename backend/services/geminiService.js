const { GoogleGenAI } = require("@google/genai");

const generateGeminiResponse = async (message) => {
  try {
    // Check if AI is enabled
    if (process.env.ENABLE_AI !== 'true') {
      return getFallbackResponse(message);
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.log('🤖 Gemini AI disabled - no API key provided');
      return getFallbackResponse(message);
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
    });

    const text = response.text;
    return text;

  } catch (error) {
    // Only log non-quota errors to reduce console noise
    if (error.status !== 429) {
      console.error("🔥 Gemini API Error:", error.message);
    } else {
      console.log('🤖 Gemini quota exceeded - using fallback response');
    }
    return getFallbackResponse(message);
  }
};

const getFallbackResponse = (message) => {
  // Extract user question from the message context
  const userQuestion = message.find(m => m.role === 'user')?.parts?.[0]?.text || 'general question';

  // Provide helpful fallback responses based on common questions
  if (userQuestion.toLowerCase().includes('task') || userQuestion.toLowerCase().includes('assignment')) {
    return "🌱 Great question about tasks! Check your dashboard for available assignments. Complete tasks to earn badges and help the environment!";
  } else if (userQuestion.toLowerCase().includes('badge') || userQuestion.toLowerCase().includes('achievement')) {
    return "🏆 Badges are earned by completing tasks and activities! Keep working on your assignments to unlock new achievements.";
  } else if (userQuestion.toLowerCase().includes('leaderboard') || userQuestion.toLowerCase().includes('rank')) {
    return "📊 Check the leaderboard to see how you rank among other students! Keep completing tasks to climb the rankings.";
  } else {
    return "🌿 Welcome to EcoVerse! I'm here to help you learn about environmental conservation. Check your dashboard for tasks, badges, and more!";
  }
};

module.exports = generateGeminiResponse;