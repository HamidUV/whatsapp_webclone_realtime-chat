import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import SplashScreen from './components/SplashScreen';

// Establish the connection to the backend server.
const socket = io('http://localhost:5001');

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  
  // Use a ref to hold the current selected chat. This helps avoid stale state in socket listeners.
  const selectedChatRef = useRef(selectedChat);
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  // --- EFFECT 1: Handle Splash Screen (This is correct) ---
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // --- EFFECT 2: Fetch initial conversations data ONCE after splash screen ---
  useEffect(() => {
    if (isLoading) return;
    axios.get('http://localhost:5001/api/conversations')
      .then(res => setConversations(res.data))
      .catch(err => console.error("Error fetching conversations:", err));
  }, [isLoading]);

  // --- EFFECT 3: Set up socket listeners ONCE when the app mounts ---
  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      // Functional update for conversations to prevent stale state
      setConversations(prevConvos => {
        const otherConvos = prevConvos.filter(c => c._id !== newMessage.wa_id);
        const updatedConvo = {
          _id: newMessage.wa_id,
          name: newMessage.wa_id,
          lastMessage: newMessage.text,
          lastMessageTimestamp: newMessage.timestamp,
        };
        // Put the most recent conversation at the top of the list
        return [updatedConvo, ...otherConvos];
      });

      // Check if the new message belongs to the currently open chat
      if (selectedChatRef.current && selectedChatRef.current._id === newMessage.wa_id) {
        // Functional update for messages to prevent stale state
        setMessages(prevMessages => [...prevMessages, newMessage]);
      }
    };
    
    const handleStatusUpdate = (updatedMessage) => {
      // Functional update for message statuses
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.message_id === updatedMessage.message_id 
            ? { ...msg, status: updatedMessage.status } 
            : msg
        )
      );
    };

    // Attach the listeners
    socket.on('newMessage', handleNewMessage);
    socket.on('statusUpdate', handleStatusUpdate);

    // This cleanup function is crucial. It runs when the component unmounts.
    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('statusUpdate', handleStatusUpdate);
    };
  }, []); // The empty array `[]` ensures this effect runs ONLY ONCE. This is the key fix.


  // --- Handler Functions ---
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setMessages([]); // Clear previous messages to show a loading state
    axios.get(`http://localhost:5001/api/messages/${chat._id}`)
      .then(res => {
        setMessages(res.data);
      });
  };
  
  const handleSendMessage = (text) => {
    if (!selectedChat) return;
    // We send the message, and our own 'newMessage' listener will handle adding it to the UI.
    // This ensures that all tabs (including the sender's) get the update from the same source of truth: the server.
    axios.post('http://localhost:5001/api/messages', {
        wa_id: selectedChat._id, text: text
    });
  };
  
  const handleBack = () => setSelectedChat(null);

  // --- Render Logic ---
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex">
      <div className={`w-full sm:w-1/3 sm:flex flex-col ${selectedChat ? 'hidden sm:flex' : 'flex'}`}>
        <ChatList
          conversations={conversations}
          onSelectChat={handleSelectChat}
          selectedChatId={selectedChat?._id}
        />
      </div>
      <div className={`w-full sm:w-2/3 flex-col ${selectedChat ? 'flex' : 'hidden sm:flex'}`}>
        <ChatWindow
          selectedChat={selectedChat}
          messages={messages}
          onSendMessage={handleSendMessage}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}

export default App;