import React, { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Message, Source } from '../types/chat';

interface MessageProps {
  message: Message;
}

// â”€â”€â”€ Code block with copy button â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silent fail
    }
  }, [code]);

  return (
    <div className="code-block-wrapper my-2">
      <div className="code-block-header">
        <span className="code-block-lang">{language || 'code'}</span>
        <button
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <div className="code-block-content">
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            background: '#0f172a',
            padding: '1em',
            fontSize: '0.8125rem',
            lineHeight: '1.6',
            fontFamily: "'Fira Code', 'Fira Mono', monospace",
          }}
          codeTagProps={{
            style: {
              fontFamily: "'Fira Code', 'Fira Mono', monospace",
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

// â”€â”€â”€ Source citation cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SourceCards: React.FC<{ sources: Source[] }> = ({ sources }) => (
  <div className="mt-3 pt-3 border-t border-[var(--accent)]">
    <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-2">
      Sources_
    </p>
    <div className="flex flex-wrap gap-2">
      {sources.map((source, idx) => {
        let hostname = source.url;
        try { hostname = new URL(source.url).hostname.replace('www.', ''); } catch { /* keep url */ }
        return (
          <a
            key={idx}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            title={source.title}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-none bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent)] hover:bg-[var(--accent)] transition-all duration-150 text-xs text-[var(--accent)] hover:text-black hover:shadow-[0_0_8px_var(--accent-glow)] max-w-[180px] group uppercase"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=16`}
              className="w-3.5 h-3.5 rounded-sm flex-shrink-0 opacity-80 group-hover:opacity-100"
              alt=""
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="truncate">{source.title || hostname}</span>
            <svg className="w-2.5 h-2.5 flex-shrink-0 opacity-40 group-hover:opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        );
      })}
    </div>
  </div>
);

// ─── Main Message component ──────────────────────────────────────────────────
const MessageBubble: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end message-animate">
        <div className="max-w-[75%] px-4 py-3 rounded-none bg-[var(--bg-card)] text-[var(--accent)] border border-[var(--accent)] shadow-[0_0_10px_var(--accent-dim)]">
          <p className="text-[0.9375rem] leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 message-animate">
      {/* Assistant avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-none bg-black border border-[var(--accent)] shadow-[0_0_8px_var(--accent-dim)] flex items-center justify-center mt-0.5">
        <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.346 2.442l-1.087-.273a15.927 15.927 0 00-7.538 0l-1.087.273c-1.377.356-2.347-1.442-1.346-2.442l1.402-1.403" />
        </svg>
      </div>

      {/* Assistant bubble */}
      <div className="max-w-[80%] px-4 py-3 rounded-none bg-black border border-[var(--border-color)] shadow-[0_0_15px_var(--accent-dim)] relative">
        <div className="markdown-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              code({ inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const codeString = String(children).replace(/\n$/, '');
                if (!inline && match) {
                  return <CodeBlock language={match[1]} code={codeString} />;
                }
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Source citation cards */}
        {message.sources && message.sources.length > 0 && (
          <SourceCards sources={message.sources} />
        )}
      </div>
    </div>
  );
};

export default MessageBubble;

