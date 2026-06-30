import React from 'react';
import type { Message } from '../types/chat';
import MessageBubble from './Message';
import LoadingIndicator from './LoadingIndicator';
import ChatInput from './ChatInput';

interface ChatProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
  onSend: (message: string) => void;
  onNewChat: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

// â”€â”€â”€ Empty state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface EmptyStateProps {
  onSend: (message: string) => void;
}

const SUGGESTIONS = [
  'What happened in the news today?',
  'Write a binary search in Python',
  'What is the CAP theorem?',
  'What is the current Bitcoin price?',
];

const EmptyState: React.FC<EmptyStateProps> = ({ onSend }) => (
  <div className="flex flex-col items-center justify-center h-full gap-6 px-4 fade-in">
    <div className="w-16 h-16 rounded-none bg-[var(--bg-card)] border border-[var(--accent)] flex items-center justify-center shadow-[0_0_15px_var(--accent-dim)]">
      <svg className="w-8 h-8 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.346 2.442l-1.087-.273a15.927 15.927 0 00-7.538 0l-1.087.273c-1.377.356-2.347-1.442-1.346-2.442l1.402-1.403" />
      </svg>
    </div>
    <div className="text-center">
      <h2 className="text-xl font-normal text-[var(--accent)] mb-2 uppercase tracking-widest animate-blink">System Ready_</h2>
      <p className="text-[var(--text-secondary)] text-sm max-w-xs leading-relaxed uppercase">
        Search the web with AI. Ask about current events, get instant answers with sources.
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-sm mt-4">
      {SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSend(suggestion)}
          className="px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--accent)] text-xs leading-snug text-left hover:bg-[var(--accent)] hover:text-black hover:border-[var(--accent)] hover:shadow-[0_0_10px_var(--accent-glow)] transition-all duration-150 cursor-pointer uppercase"
        >
          {`> ${suggestion}`}
        </button>
      ))}
    </div>
  </div>
);

// â”€â”€â”€ Error banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface ErrorBannerProps {
  error: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ error }) => (
  <div className="mx-4 mb-4 px-4 py-3 bg-red-900/20 border border-red-500 text-red-500 text-sm flex items-center gap-2 uppercase shadow-[0_0_10px_rgba(239,68,68,0.5)]">
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
    {error}
  </div>
);

// â”€â”€â”€ Main Chat component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Chat: React.FC<ChatProps> = ({
  messages,
  loading,
  error,
  onSend,
  onNewChat,
  messagesEndRef,
}) => {
  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[var(--accent)] bg-[var(--bg-card)] shadow-[0_4px_15px_var(--accent-dim)] z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black border border-[var(--accent)] flex items-center justify-center">
            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.346 2.442l-1.087-.273a15.927 15.927 0 00-7.538 0l-1.087.273c-1.377.356-2.347-1.442-1.346-2.442l1.402-1.403" />
            </svg>
          </div>
          <div>
            <h1 className="text-[var(--accent)] font-bold text-base leading-tight uppercase tracking-widest">AI Terminal</h1>
            <p className="text-[var(--text-secondary)] text-xs uppercase">Powered by Gemini</p>
          </div>
        </div>

        <button
          id="new-chat-button"
          onClick={onNewChat}
          disabled={loading}
          className="
            flex items-center gap-2 px-3 py-2 text-sm uppercase tracking-wider
            bg-transparent text-[var(--accent)] border border-[var(--border-color)]
            hover:bg-[var(--accent)] hover:text-black hover:border-[var(--accent)] hover:shadow-[0_0_8px_var(--accent-glow)]
            active:scale-95 transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
          "
          aria-label="Start new chat"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="hidden sm:inline">New Session</span>
        </button>
      </header>

      {/* Message list */}
      <main
        id="chat-messages"
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6"
        aria-label="Chat messages"
      >
        {messages.length === 0 && !loading ? (
          <EmptyState onSend={onSend} />
        ) : (
          <div className="max-w-3xl mx-auto flex flex-col gap-5">
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} />
            ))}
            {loading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Error */}
      {error && <ErrorBanner error={error} />}

      {/* Input */}
      <ChatInput onSend={onSend} disabled={loading} />
    </div>
  );
};

export default Chat;

