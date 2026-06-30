import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message } from '../types/chat';
import { createChat, sendMessage } from '../services/api';

interface ChatState {
  chatId: string | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}

interface UseChatReturn extends ChatState {
  startNewChat: () => Promise<void>;
  sendChatMessage: (content: string) => Promise<void>;
  clearError: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function useChat(): UseChatReturn {
  const [state, setState] = useState<ChatState>({
    chatId: null,
    messages: [],
    loading: false,
    error: null,
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, state.loading, scrollToBottom]);

  const startNewChat = useCallback(async () => {
    setState({ chatId: null, messages: [], loading: true, error: null });
    try {
      const { chatId } = await createChat();
      setState({ chatId, messages: [], loading: false, error: null });
    } catch {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Failed to start a new chat. Is the server running?',
      }));
    }
  }, []);

  const sendChatMessage = useCallback(
    async (content: string) => {
      if (!state.chatId || !content.trim() || state.loading) return;

      const userMessage: Message = { role: 'user', content };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        loading: true,
        error: null,
      }));

      try {
        const { messages, sources } = await sendMessage(state.chatId, content);

        // Attach sources to the last message (the assistant reply)
        const messagesWithSources = sources?.length
          ? messages.map((msg, idx) =>
              idx === messages.length - 1 ? { ...msg, sources } : msg
            )
          : messages;

        setState((prev) => ({
          ...prev,
          messages: messagesWithSources,
          loading: false,
        }));
      } catch {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: 'Failed to send message. Please try again.',
        }));
      }
    },
    [state.chatId, state.loading]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    startNewChat,
    sendChatMessage,
    clearError,
    messagesEndRef,
  };
}
