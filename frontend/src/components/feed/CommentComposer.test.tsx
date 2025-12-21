import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { CommentComposer } from './CommentComposer';

describe('CommentComposer - Task 2: Submission Functionality', () => {
  afterEach(() => {
    cleanup();
  });

  it('should submit valid content and clear input field', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    
    render(<CommentComposer onSubmit={mockOnSubmit} />);
    
    const textarea = screen.getByLabelText(/write a comment/i);
    const submitButton = screen.getByRole('button', { name: /post/i });
    
    // Type valid content
    fireEvent.change(textarea, { target: { value: 'This is a valid comment' } });
    
    // Submit the form
    fireEvent.click(submitButton);
    
    // Verify submission was called with trimmed content
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('This is a valid comment');
    });
    
    // Verify input field is cleared after successful submission
    await waitFor(() => {
      expect((textarea as HTMLTextAreaElement).value).toBe('');
    });
  });

  it('should prevent submission of empty content', async () => {
    const mockOnSubmit = vi.fn();
    
    render(<CommentComposer onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /post/i });
    
    // Try to submit empty content
    fireEvent.click(submitButton);
    
    // Verify submission was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
    
    // Verify button is disabled for empty content
    expect((submitButton as HTMLButtonElement).disabled).toBe(true);
  });

  it('should prevent submission of whitespace-only content', async () => {
    const mockOnSubmit = vi.fn();
    
    render(<CommentComposer onSubmit={mockOnSubmit} />);
    
    const textarea = screen.getByLabelText(/write a comment/i);
    const submitButton = screen.getByRole('button', { name: /post/i });
    
    // Type whitespace-only content
    fireEvent.change(textarea, { target: { value: '   \n\t   ' } });
    
    // Try to submit
    fireEvent.click(submitButton);
    
    // Verify submission was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
    
    // Verify button is disabled for whitespace-only content
    expect((submitButton as HTMLButtonElement).disabled).toBe(true);
  });

  it('should show loading state during submission', async () => {
    const mockOnSubmit = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<CommentComposer onSubmit={mockOnSubmit} />);
    
    const textarea = screen.getByLabelText(/write a comment/i);
    const submitButton = screen.getByRole('button', { name: /post/i });
    
    // Type valid content
    fireEvent.change(textarea, { target: { value: 'Test comment' } });
    
    // Submit the form
    fireEvent.click(submitButton);
    
    // Verify loading state is shown
    expect(screen.getByText('Posting...')).toBeDefined();
    expect((submitButton as HTMLButtonElement).disabled).toBe(true);
    expect((textarea as HTMLTextAreaElement).disabled).toBe(true);
    
    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.getByText('Post')).toBeDefined();
    });
  });

  it('should handle submission errors gracefully', async () => {
    const mockOnSubmit = vi.fn().mockRejectedValue(new Error('Network error'));
    
    render(<CommentComposer onSubmit={mockOnSubmit} />);
    
    const textarea = screen.getByLabelText(/write a comment/i);
    const submitButton = screen.getByRole('button', { name: /post/i });
    
    // Type valid content
    fireEvent.change(textarea, { target: { value: 'Test comment' } });
    
    // Submit the form
    fireEvent.click(submitButton);
    
    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeDefined();
    });
    
    // Verify content is preserved after error
    expect((textarea as HTMLTextAreaElement).value).toBe('Test comment');
    
    // Verify button is re-enabled after error
    expect((submitButton as HTMLButtonElement).disabled).toBe(false);
  });
});