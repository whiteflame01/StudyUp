import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ChatPanel } from './ChatPanel';

// Mock the ChatWindow component since we're only testing placeholder states
vi.mock('./ChatWindow', () => ({
  ChatWindow: ({ userId }: { userId: string }) => (
    <div data-testid="chat-window">Chat with user {userId}</div>
  )
}));

describe('ChatPanel - Placeholder States', () => {
  afterEach(() => {
    cleanup();
  });

  it('should display "Select a conversation" placeholder when no conversation is selected', () => {
    render(<ChatPanel selectedUserId={null} />);
    
    // Check for placeholder elements
    expect(screen.getByText('Select a conversation')).toBeDefined();
    expect(screen.getByText('Choose a conversation from the list to start messaging')).toBeDefined();
    
    // Check for messaging icon
    const messageIcon = document.querySelector('svg');
    expect(messageIcon).toBeDefined();
  });

  it('should display anonymous messaging information card in placeholder state', () => {
    render(<ChatPanel selectedUserId={null} />);
    
    // Check for anonymous messaging card - use getAllByText since there might be multiple instances
    const anonymousHeaders = screen.getAllByText('Anonymous Messaging');
    expect(anonymousHeaders.length).toBeGreaterThan(0);
    
    const anonymousDescriptions = screen.getAllByText('All conversations are anonymous. Users only see your User ID, never your real identity or email.');
    expect(anonymousDescriptions.length).toBeGreaterThan(0);
  });

  it('should display ChatWindow when a conversation is selected', () => {
    render(<ChatPanel selectedUserId="user123" />);
    
    // Should show chat window instead of placeholder
    expect(screen.getByTestId('chat-window')).toBeDefined();
    expect(screen.getByText('Chat with user user123')).toBeDefined();
  });

  it('should display back button when onBack is provided', () => {
    const mockOnBack = vi.fn();
    
    render(<ChatPanel selectedUserId="user123" onBack={mockOnBack} />);
    
    // Check for back button and text
    expect(screen.getByText('Back to conversations')).toBeDefined();
    
    // Click back button
    const backButton = screen.getByRole('button');
    fireEvent.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalledOnce();
  });

  it('should not display back button when onBack is not provided and conversation is selected', () => {
    render(<ChatPanel selectedUserId="user123" />);
    
    // Should not show back button text when onBack is not provided
    expect(screen.queryByText('Back to conversations')).toBeNull();
  });

  it('should not display back button in placeholder state even when onBack is provided', () => {
    const mockOnBack = vi.fn();
    
    render(<ChatPanel selectedUserId={null} onBack={mockOnBack} />);
    
    // Should not show back button in placeholder state
    expect(screen.queryByText('Back to conversations')).toBeNull();
  });
});