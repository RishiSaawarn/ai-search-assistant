import { useEffect } from 'react';
import { useChat } from './hooks/useChat';
import Chat from './components/Chat';

function App() {
  const {
    chatId,
    messages,
    loading,
    error,
    startNewChat,
    sendChatMessage,
    messagesEndRef,
  } = useChat();

  // Auto-start a chat session on mount
  useEffect(() => {
    startNewChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden">
      {/* 
        No sidebar per requirements — pure single-column chat UI.
        The chatId is kept in state only; it's not shown to the user.
      */}
      <div className="flex-1 flex flex-col min-w-0" aria-label={`Chat session ${chatId ?? 'loading'}`}>
        <Chat
          messages={messages}
          loading={loading}
          error={error}
          onSend={sendChatMessage}
          onNewChat={startNewChat}
          messagesEndRef={messagesEndRef}
        />
      </div>
    </div>
  );
}

export default App;
