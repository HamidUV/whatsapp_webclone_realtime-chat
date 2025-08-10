import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble'; // We will create this next
import { ArrowLeft, Send } from 'lucide-react'; // For icons

function ChatWindow({ selectedChat, messages, onSendMessage, onBack }) {
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };
  
  // Placeholder for when no chat is selected on desktop
  if (!selectedChat) {
    return (
        <div className="hidden sm:flex flex-col items-center justify-center h-full bg-gray-100 text-gray-500">
            <h2 className="text-2xl">Select a chat to start messaging</h2>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-gray-200">
      {/* Chat Header */}
      <header className="flex items-center p-3 border-b border-gray-300 bg-gray-100 flex-shrink-0">
        <button onClick={onBack} className="mr-4 text-gray-600 sm:hidden">
            <ArrowLeft />
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-300 mr-4 flex-shrink-0" />
        <h2 className="font-bold text-gray-800">{selectedChat.name}</h2>
      </header>

      {/* Message Area */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col space-y-2">
            {messages.map((msg) => (
                <MessageBubble key={msg._id || msg.message_id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 bg-gray-100 border-t border-gray-300 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button type="submit" className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 focus:outline-none">
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatWindow;