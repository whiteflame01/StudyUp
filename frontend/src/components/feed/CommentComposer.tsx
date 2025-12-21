import React, { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// TypeScript interfaces as specified in the design document
export interface CommentComposerProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  maxLength?: number;
}

interface CommentComposerState {
  content: string;
  isSubmitting: boolean;
  error: string | null;
}

export const CommentComposer: React.FC<CommentComposerProps> = ({
  onSubmit,
  placeholder = "What's on your mind? Share your thoughts with fellow study buddies...",
  maxLength = 500
}) => {
  // Local state management for content, submission status, and error handling
  const [state, setState] = useState<CommentComposerState>({
    content: '',
    isSubmitting: false,
    error: null
  });

  // Refs for accessibility and focus management
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const composerId = `comment-composer-${Math.random().toString(36).substr(2, 9)}`;
  const helpTextId = `${composerId}-help`;
  const errorId = `${composerId}-error`;
  const statusId = `${composerId}-status`;

  // Handle text input changes
  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = event.target.value;
    
    // Respect maxLength if provided
    if (maxLength && newContent.length > maxLength) {
      return;
    }

    setState(prev => ({
      ...prev,
      content: newContent,
      error: null // Clear any previous errors when user types
    }));
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      if (!isSubmitDisabled) {
        handleSubmit(event as any);
      }
    }
    
    // Navigate to submit button on Tab when at end of textarea
    if (event.key === 'Tab' && !event.shiftKey) {
      const textarea = event.currentTarget;
      const cursorPosition = textarea.selectionStart;
      const textLength = textarea.value.length;
      
      // If cursor is at the end of text, let natural tab behavior occur
      if (cursorPosition === textLength) {
        // Natural tab will move to submit button
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate content (non-empty, not just whitespace)
    const trimmedContent = state.content.trim();
    if (!trimmedContent) {
      // Prevent submission of empty content - maintain current state
      // Focus back to textarea for better UX
      textareaRef.current?.focus();
      return;
    }

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      await onSubmit(trimmedContent);
      // Clear input field after successful submission
      setState(prev => ({
        ...prev,
        content: '',
        isSubmitting: false
      }));
      // Focus back to textarea for continued interaction
      textareaRef.current?.focus();
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: error instanceof Error ? error.message : 'Failed to post comment'
      }));
      // Focus back to textarea after error
      textareaRef.current?.focus();
    }
  };

  // Determine if submit button should be enabled
  const isSubmitDisabled = !state.content.trim() || state.isSubmitting;

  // Character count with accessibility considerations
  const characterCount = state.content.length;
  const isNearLimit = maxLength && characterCount > maxLength * 0.8;
  const isAtLimit = maxLength && characterCount >= maxLength;

  return (
    <div 
      className="bg-card border border-border rounded-lg transition-all duration-200 hover:shadow-md hover:border-border/80
                 p-3 mb-4 sm:p-4 sm:mb-6 
                 md:p-5 md:mb-6 
                 lg:p-6 lg:mb-8"
      role="region"
      aria-labelledby={`${composerId}-title`}
    >
      {/* Screen reader title */}
      <h2 id={`${composerId}-title`} className="sr-only">
        Comment Composer
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        {/* Text area for comment input with responsive sizing */}
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={state.content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={state.isSubmitting}
            className="min-h-[80px] sm:min-h-[100px] md:min-h-[120px] lg:min-h-[140px] 
                       resize-none transition-all duration-200 focus:shadow-sm
                       text-sm sm:text-base
                       scrollbar-thin overflow-y-auto
                       focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                       focus-visible:border-ring"
            aria-label="Write a comment to share with fellow study buddies"
            aria-describedby={`${helpTextId} ${state.error ? errorId : ''}`}
            aria-invalid={state.error ? 'true' : 'false'}
            aria-required="true"
            maxLength={maxLength}
            spellCheck="true"
            autoComplete="off"
            autoCorrect="on"
            autoCapitalize="sentences"
          />
          
          {/* Visual focus indicator enhancement */}
          <div 
            className="absolute inset-0 rounded-md pointer-events-none transition-all duration-200
                       ring-0 ring-transparent
                       peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2"
            aria-hidden="true"
          />
        </div>
        
        {/* Helper text for accessibility and keyboard shortcuts */}
        <div id={helpTextId} className="sr-only">
          Enter your comment here. Use Ctrl+Enter or Cmd+Enter to submit quickly. 
          Press Tab to navigate to the post button.
          {maxLength && ` Maximum ${maxLength} characters allowed.`}
          {isNearLimit && ` You are approaching the character limit.`}
          {isAtLimit && ` You have reached the character limit.`}
        </div>
        
        {/* Character count and submit button row with responsive layout */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          {/* Character count with responsive text sizing */}
          <div className="order-2 sm:order-1">
            {maxLength && (
              <div 
                className={`text-xs sm:text-sm transition-colors duration-200 ${
                  isAtLimit 
                    ? 'text-destructive font-medium' 
                    : isNearLimit 
                    ? 'text-warning font-medium' 
                    : 'text-muted-foreground'
                }`}
                aria-live="polite"
                aria-label={`Character count: ${characterCount} of ${maxLength}`}
              >
                <span className="tabular-nums">
                  {characterCount}/{maxLength}
                </span>
                {isAtLimit && (
                  <span className="ml-1 text-xs">
                    (limit reached)
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Submit button with responsive sizing */}
          <div className="order-1 sm:order-2 flex justify-end">
            <Button
              ref={submitButtonRef}
              type="submit"
              disabled={isSubmitDisabled}
              size="default"
              className="px-4 py-2 sm:px-6 md:px-8 
                         text-sm sm:text-base
                         transition-all duration-200 
                         hover:scale-105 active:scale-95 disabled:hover:scale-100
                         focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                         disabled:cursor-not-allowed"
              aria-describedby={state.isSubmitting ? statusId : undefined}
              aria-label={state.isSubmitting ? 'Posting comment, please wait' : 'Post comment'}
            >
              {state.isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />
                  <span className="hidden sm:inline">Posting...</span>
                  <span className="sm:hidden">Post...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Post Comment</span>
                  <span className="sm:hidden">Post</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Loading status for screen readers */}
        {state.isSubmitting && (
          <div 
            id={statusId} 
            className="sr-only" 
            aria-live="assertive"
            role="status"
          >
            Your comment is being posted, please wait.
          </div>
        )}

        {/* Error display with enhanced accessibility */}
        {state.error && (
          <div 
            id={errorId}
            className="text-sm text-destructive bg-destructive/10 border border-destructive/20 
                       rounded-md p-3 transition-all duration-200
                       focus-within:ring-2 focus-within:ring-destructive/50" 
            role="alert"
            aria-live="assertive"
            tabIndex={-1}
          >
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 mt-0.5">
                <svg 
                  className="w-4 h-4" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">Error posting comment</p>
                <p className="mt-1 text-xs sm:text-sm break-words">
                  {state.error}
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CommentComposer;