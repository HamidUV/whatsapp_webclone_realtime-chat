import React from 'react';
import ChatListItem from './ChatListItem';

function ChatList({ conversations, onSelectChat, selectedChatId }) {
  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 bg-gray-50">
        <h1 className="text-xl font-bold text-gray-800">Chats</h1>
      </header>
      
      {/* Conversation List */}
      <div className="flex-grow overflow-y-auto">
        {conversations.length > 0 ? (
          conversations.map(convo => (
            <ChatListItem
              key={convo._id}
              convo={convo}
              onClick={() => onSelectChat(convo)}
              isActive={selectedChatId === convo._id}
            />
          ))
        ) : (
          <p className="p-4 text-center text-gray-500">No conversations yet.</p>
        )}
      </div>
    </div>
  );
}

export default ChatList;