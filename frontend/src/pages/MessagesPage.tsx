import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { mockUsers, mockMessages, currentUser } from '@/data/mockData';
import { User, Message } from '@/types';
import { ConversationPanel } from '@/components/chat/ConversationPanel';
import { ChatPanel } from '@/components/chat/ChatPanel';

interface Conversation {
  userId: string;
  user: User;
  lastMessage: Message;
  unreadCount: number;
  lastActivity: Date;
}

export default function MessagesPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Create conversations from messages and users
  useEffect(() => {
    const conversationMap = new Map<string, Conversation>();
    
    // Process messages to create conversations
    mockMessages.forEach(message => {
      const otherUserId = message.senderId === currentUser.id ? message.receiverId : message.senderId;
      const user = mockUsers.find(u => u.id === otherUserId);
      
      if (user) {
        const existing = conversationMap.get(otherUserId);
        if (!existing || message.sentAt > existing.lastMessage.sentAt) {
          conversationMap.set(otherUserId, {
            userId: otherUserId,
            user,
            lastMessage: message,
            unreadCount: message.receiverId === currentUser.id && !message.readAt ? 1 : 0,
            lastActivity: message.sentAt,
          });
        }
      }
    });

    // Add additional users without messages for demo purposes
    mockUsers.slice(0, 5).forEach((user, idx) => {
      if (!conversationMap.has(user.id)) {
        conversationMap.set(user.id, {
          userId: user.id,
          user,
          lastMessage: mockMessages[idx % mockMessages.length],
          unreadCount: idx === 0 ? 2 : idx === 2 ? 1 : 0,
          lastActivity: new Date(Date.now() - idx * 3600000), // Stagger times
        });
      }
    });

    const conversationList = Array.from(conversationMap.values())
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
    
    setConversations(conversationList);
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleBackToList = () => {
    setSelectedUserId(null);
  };

  return (
    <div className="h-full flex">
      {/* Two-panel layout with responsive behavior */}
      <div className="flex w-full h-full">
        {/* Conversation Panel - Left side */}
        <div className={`
          ${isMobile ? (selectedUserId ? 'hidden' : 'w-full') : 'w-80 border-r'}
          flex-shrink-0 bg-card
        `}>
          <ConversationPanel
            conversations={conversations}
            selectedUserId={selectedUserId}
            searchQuery={searchQuery}
            onSelectUser={handleSelectUser}
            onSearchChange={handleSearchChange}
          />
        </div>

        {/* Chat Panel - Right side */}
        <div className={`
          ${isMobile ? (selectedUserId ? 'w-full' : 'hidden') : 'flex-1'}
          bg-background
        `}>
          <ChatPanel
            selectedUserId={selectedUserId}
            onBack={isMobile ? handleBackToList : undefined}
          />
        </div>
      </div>
    </div>
  );
}
