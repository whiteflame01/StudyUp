import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConversationPanel } from './ConversationPanel';
import { User, Message } from '@/types';

// Mock data for testing
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  avatar: 'avatar.jpg',
  online: true,
  similarity: 85
};

const mockMessage: Message = {
  id: '1',
  senderId: '1',
  receiverId: '2',
  content: 'Hello there!',
  sentAt: new Date(),
  readAt: undefined
};

const mockConversation = {
  userId: '1',
  user: mockUser,
  lastMessage: mockMessage,
  unreadCount: 2,
  lastActivity: new Date()
};

describe('ConversationPanel - Placeholder States', () => {
  const defaultProps = {
    conversations: [],
    selectedUserId: null,
    searchQuery: '',
    onSelectUser: vi.fn(),
    onSearchChange: vi.fn(),
    onNewMessage: vi.fn()
  };

  it('should display "No messages yet" placeholder when no conversations exist', () => {
    render(<ConversationPanel {...defaultProps} />);
    
    // Check for placeholder elements
    expect(screen.getByText('No messages yet')).toBeDefined();
    expect(screen.getByText('Start a conversation with your study buddies')).toBeDefined();
    
    // Check for messaging icon
    const messageIcon = document.querySelector('svg');
    expect(messageIcon).toBeDefined();
  });

  it('should display "No conversations found" placeholder when search has no results', () => {
    render(<ConversationPanel {...defaultProps} searchQuery="nonexistent" />);
    
    // Check for search-specific placeholder
    expect(screen.getByText('No conversations found')).toBeDefined();
    expect(screen.getByText('Try searching with different keywords')).toBeDefined();
  });

  it('should display conversations when they exist', () => {
    const props = {
      ...defaultProps,
      conversations: [mockConversation]
    };
    
    render(<ConversationPanel {...props} />);
    
    // Should show conversation instead of placeholder
    expect(screen.getByText('John Doe')).toBeDefined();
    expect(screen.getByText('Hello there!')).toBeDefined();
    expect(screen.queryByText('No messages yet')).toBeNull();
  });

  it('should show placeholder New Message button when onNewMessage is provided and no conversations exist', () => {
    const mockOnNewMessage = vi.fn();
    const props = {
      ...defaultProps,
      onNewMessage: mockOnNewMessage
    };
    
    render(<ConversationPanel {...props} />);
    
    // Should show the placeholder with New Message button
    expect(screen.getByText('No messages yet')).toBeDefined();
    
    // Find and click the New Message button in the placeholder
    const buttons = screen.getAllByText('New Message');
    expect(buttons.length).toBeGreaterThan(0);
    
    // Click the last button (which should be the placeholder button)
    fireEvent.click(buttons[buttons.length - 1]);
    
    expect(mockOnNewMessage).toHaveBeenCalledOnce();
  });

  it('should not show placeholder New Message button when onNewMessage is not provided', () => {
    const props = {
      ...defaultProps,
      onNewMessage: undefined
    };
    
    render(<ConversationPanel {...props} />);
    
    // Should show placeholder but without New Message button
    expect(screen.getByText('No messages yet')).toBeDefined();
    expect(screen.queryByText('New Message')).toBeNull();
  });
});