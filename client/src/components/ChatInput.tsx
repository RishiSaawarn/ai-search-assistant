import React, { useState, useRef, useCallback } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-resize textarea
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-[var(--accent)] bg-[var(--bg-card)] px-4 py-4 sm:px-6 shadow-[0_-4px_15px_var(--accent-dim)] relative z-10">
      <div className="max-w-3xl mx-auto">
        <div
          className={`
            flex items-end gap-3 rounded-none border bg-black px-4 py-3
            transition-all duration-150
            ${disabled ? 'border-[var(--border-color)] opacity-70' : 'border-[var(--border-color)] hover:border-[var(--accent)] hover:shadow-[0_0_10px_var(--accent-dim)] focus-within:border-[var(--accent)] focus-within:shadow-[0_0_15px_var(--accent-glow)]'}
          `}
        >
          <textarea
            id="chat-input"
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="[ Awaiting input... ]"
            rows={1}
            className="
              flex-1 resize-none bg-transparent text-[var(--accent)] placeholder-[var(--border-color)]
              text-[0.9375rem] leading-relaxed outline-none
              max-h-[200px] overflow-y-auto uppercase
              disabled:cursor-not-allowed
            "
            style={{ scrollbarWidth: 'none' }}
            aria-label="Chat message input"
          />

          <button
            id="send-button"
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
            className={`
              flex-shrink-0 w-9 h-9 rounded-none flex items-center justify-center border
              transition-all duration-150 uppercase
              ${canSend
                ? 'bg-[var(--accent)] text-black border-[var(--accent)] hover:bg-black hover:text-[var(--accent)] active:scale-95 shadow-[0_0_10px_var(--accent-glow)]'
                : 'bg-black text-[var(--border-color)] border-[var(--border-color)] cursor-not-allowed'
              }
            `}
          >
            {disabled ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            )}
          </button>
        </div>

        <p className="mt-2 text-center text-[0.65rem] text-[var(--text-secondary)] uppercase tracking-widest opacity-70">
          AI // SYSTEM // VERIFY OUTPUTS
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
