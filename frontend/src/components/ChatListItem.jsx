import React from 'react';
import { format, isToday, isYesterday } from 'date-fns';

const formatTimestamp = (ts) => {
  if (!ts) return '';
  const date = new Date(ts);
  if (isToday(date)) return format(date, 'p');
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'dd/MM/yyyy');
};

function ChatListItem({ convo, onClick, isActive }) {
  const displayName = convo.name || convo._id;

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 cursor-pointer border-b border-gray-100 ${isActive ? 'bg-gray-200' : 'hover:bg-gray-50'}`}
    >
      <div className="flex-shrink-0 mr-4">
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
          {displayName.substring(0, 2).toUpperCase()}
        </div>
      </div>
      <div className="flex-grow overflow-hidden">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-800 truncate">{displayName}</p>
          <p className="text-xs text-gray-500 flex-shrink-0 ml-2">
            {formatTimestamp(convo.lastMessageTimestamp)}
          </p>
        </div>
        <p className="text-sm text-gray-500 truncate">{convo.lastMessage}</p>
      </div>
    </div>
  );
}

export default ChatListItem;