import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 message-animate">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1e293b] border border-[#334155] flex items-center justify-center">
        <svg className="w-4 h-4 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.346 2.442l-1.087-.273a15.927 15.927 0 00-7.538 0l-1.087.273c-1.377.356-2.347-1.442-1.346-2.442l1.402-1.403" />
        </svg>
      </div>

      {/* Typing bubble */}
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm bg-[#1e293b] border border-[#334155]">
        <span className="typing-dot block w-2 h-2 rounded-full bg-[#3b82f6]" />
        <span className="typing-dot block w-2 h-2 rounded-full bg-[#3b82f6]" />
        <span className="typing-dot block w-2 h-2 rounded-full bg-[#3b82f6]" />
      </div>
    </div>
  );
};

export default LoadingIndicator;
