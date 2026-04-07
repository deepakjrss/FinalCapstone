import React, { useState, useRef, useEffect } from 'react';
import ModernSidebar from '../components/ModernSidebar';
import ModernTopNavbar from '../components/ModernTopNavbar';
import chatService from '../services/chatService';

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  // Smart suggestions for personalized AI interaction
  const suggestions = [
    "How can I improve my eco score?",
    "What tasks should I complete next?",
    "Suggest eco-friendly habits for me",
    "How is my class doing environmentally?",
    "What are the easiest tasks to start with?"
  ];

  // Quick action buttons
  const quickActions = [
    { label: "Improve Score", message: "How can I improve my eco score?" },
    { label: "Task Ideas", message: "Suggest tasks I should complete" },
    { label: "Class Stats", message: "How is my class performing?" },
    { label: "Eco Tips", message: "Give me personalized eco tips" }
  ];

  // scroll to bottom when messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const [aiHealthStatus, setAiHealthStatus] = useState('unknown'); // unknown | checking | available | unavailable
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      setAiHealthStatus('checking');
      const result = await chatService.checkHealth();
      setLastChecked(new Date());
      if (result.success && result.data?.status === 'available') {
        setAiHealthStatus('available');
      } else {
        setAiHealthStatus('unavailable');
      }
    };

    checkHealth();
  }, []);

  const sendMessage = async (messageText = null) => {
    const text = messageText || input.trim();
    if (!text) return;

    // add user message
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    if (!messageText) setInput(''); // Only clear input if it wasn't a quick action
    setSending(true);

    try {
      if (aiHealthStatus === 'unavailable') {
        setMessages((prev) => [...prev, { sender: 'ai', text: 'AI is taking a break 🌱 Try again soon!' }]);
        setSending(false);
        return;
      }

      const res = await chatService.sendMessage(text);

      if (res.success) {
        const aiText = res.data?.reply?.trim() || "🌿 I'm your Eco Assistant! Try planting a tree today!";
        setMessages((prev) => [...prev, { sender: 'ai', text: aiText }]);
      } else {
        setAiHealthStatus('unavailable');
        setMessages((prev) => [...prev, { sender: 'ai', text: "🌿 I'm your Eco Assistant! Try planting a tree today!" }]);
      }
    } catch (err) {
      console.error('AIChat sendMessage error:', err);
      setAiHealthStatus('unavailable');
      setMessages((prev) => [...prev, { sender: 'ai', text: "🌿 I'm your Eco Assistant! Try planting a tree today!" }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickAction = (message) => {
    sendMessage(message);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const handleHealthCheck = async () => {
    setAiHealthStatus('checking');
    const result = await chatService.checkHealth();
    setLastChecked(new Date());

    if (result.success && result.data?.status === 'available') {
      setAiHealthStatus('available');
    } else {
      setAiHealthStatus('unavailable');
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      <ModernTopNavbar />
      <div className="flex flex-1 pt-16">
        <ModernSidebar />
        <main className="flex-1 flex flex-col overflow-auto pl-64">
          <div className="flex items-center justify-between gap-4 p-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm">
              <span className="text-sm font-semibold text-gray-700">AI Status:</span>
              {aiHealthStatus === 'available' && (
                <span className="text-sm font-semibold text-green-700">✅ Available</span>
              )}
              {aiHealthStatus === 'unavailable' && (
                <span className="text-sm font-semibold text-red-700">❌ Unavailable</span>
              )}
              {aiHealthStatus === 'checking' && (
                <span className="text-sm font-semibold text-yellow-700">⏳ Checking</span>
              )}
              {aiHealthStatus === 'unknown' && (
                <span className="text-sm font-semibold text-gray-700">⚪ Unknown</span>
              )}
              {lastChecked && (
                <span className="text-xs text-gray-500 ml-2">Last checked: {new Date(lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              )}
            </div>
            <button
              onClick={handleHealthCheck}
              disabled={aiHealthStatus === 'checking'}
              className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Check AI Status
            </button>
          </div>

          {/* Welcome message for new users */}
          {messages.length === 0 && (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center max-w-2xl">
                <div className="text-6xl mb-4">🌿</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to EcoVerse AI Guardian</h2>
                <p className="text-gray-600 mb-6">
                  Your personal environmental assistant knows your eco score, completed tasks, and can give personalized advice to help you make a real impact!
                </p>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6 max-w-md mx-auto">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(action.message)}
                      disabled={sending}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>

                {/* Smart Suggestions */}
                <div className="text-left max-w-lg mx-auto">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">💡 Try asking:</h3>
                  <div className="space-y-2">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-green-300"
                      >
                        <span className="text-gray-700">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat area */}
          {aiHealthStatus === 'checking' && (
            <div className="p-4 text-center bg-yellow-100 border border-yellow-300 rounded-lg mb-4">
              <p className="text-yellow-700">Checking AI health... 🌿</p>
            </div>
          )}
          {aiHealthStatus === 'unavailable' && (
            <div className="p-4 text-center bg-red-100 border border-red-300 rounded-lg mb-4">
              <p className="text-red-700">AI is taking a break. You can still chat and get friendly fallback tips. 🌱</p>
            </div>
          )}
          {messages.length > 0 && (
            <div className="flex-1 p-6 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg relative transition-all duration-300
                      ${msg.sender === 'user'
                        ? 'bg-green-600 text-white animate-slide-in-right'
                        : 'bg-white text-gray-800 shadow animate-slide-in-left'}` }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 shadow p-3 rounded-lg animate-pulse max-w-[70%]">
                    🌿 Forest Guardian is thinking...
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}

          {/* Input area */}
          <div className="border-t bg-white p-4 flex items-center space-x-3">
            <textarea
              rows={1}
              className="flex-1 resize-none p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ask the Forest Guardian..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              disabled={sending}
              onClick={() => sendMessage()}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIChat;
