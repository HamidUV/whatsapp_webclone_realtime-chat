import React from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

function MessageBubble({ message }) {
    const isMe = message.from === 'me';
    
    const StatusTicks = () => {
        if (!isMe) return null;
        if (message.status === 'read') return <CheckCheck size={16} className="text-blue-500 ml-1" />;
        if (message.status === 'delivered' || message.status === 'sent') return <CheckCheck size={16} className="text-gray-400 ml-1" />;
        return <Check size={16} className="text-gray-400 ml-1" />; // For pending/sent
    }

    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`
                max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow
                ${isMe ? 'bg-green-100' : 'bg-white'}
            `}>
                <p className="text-sm text-gray-800">{message.text}</p>
                <div className="flex items-end justify-end mt-1">
                    <p className="text-xs text-gray-400 mr-2">
                        {format(new Date(message.timestamp), 'p')}
                    </p>
                    <StatusTicks />
                </div>
            </div>
        </div>
    );
}

export default MessageBubble;