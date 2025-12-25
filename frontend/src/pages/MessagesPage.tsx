import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';

export default function MessagesPage() {
  const location = useLocation();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Handle navigation from Explore page
  useEffect(() => {
    if (location.state?.selectedUserId) {
      setSelectedUserId(location.state.selectedUserId);
    }
  }, [location.state]);

  return (
    <div className="h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] flex">
      {/* On mobile: hide sidebar when chat is open. On desktop: always show */}
      <div className={selectedUserId ? 'hidden md:block' : 'flex-1 md:flex-initial'}>
        <ChatSidebar 
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
        />
      </div>
      
      {/* On mobile: hide chat when not selected. On desktop: show empty state or chat */}
      {selectedUserId ? (
        <div className="flex-1">
          <ChatWindow userId={selectedUserId} onBack={() => setSelectedUserId(null)} />
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-gray-400 text-sm sm:text-base px-4">
          Select a conversation
        </div>
      )}
    </div>
  );
}
