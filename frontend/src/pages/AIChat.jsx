import React, { useState, useRef, useEffect } from 'react';
import ModernSidebar from '../components/ModernSidebar';
import ModernTopNavbar from '../components/ModernTopNavbar';
import chatService from '../services/chatService';

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  // scroll to bottom when messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    // add user message
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInput('');
    setSending(true);

    try {
      const res = await chatService.sendMessage(text);
      if (res.success) {
        setMessages((prev) => [...prev, { sender: 'ai', text: res.data.reply }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'ai', text: `(error) ${res.error}` }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', text: '(network error)' }]);
    }
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      <ModernTopNavbar />
      <div className="flex flex-1 pt-16">
        <ModernSidebar />
        <main className="flex-1 flex flex-col overflow-auto pl-64">
          {/* Chat area */}
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
            <div ref={endRef} />
          </div>

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
              onClick={sendMessage}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
