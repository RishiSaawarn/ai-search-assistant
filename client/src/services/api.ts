import axios from 'axios';
import type { CreateChatResponse, Chat, SendMessageResponse } from '../types/chat';

const api = axios.create({
  baseURL: '/chats',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Creates a new chat session.
 */
export async function createChat(): Promise<CreateChatResponse> {
  const response = await api.post<CreateChatResponse>('');
  return response.data;
}

/**
 * Sends a message to an existing chat.
 */
export async function sendMessage(chatId: string, message: string): Promise<SendMessageResponse> {
  const response = await api.post<SendMessageResponse>(`/${chatId}/messages`, { message });
  return response.data;
}

/**
 * Retrieves the current state of a chat.
 */
export async function getChat(chatId: string): Promise<Chat> {
  const response = await api.get<Chat>(`/${chatId}`);
  return response.data;
}

/**
 * Deletes a chat session.
 */
export async function deleteChat(chatId: string): Promise<void> {
  await api.delete(`/${chatId}`);
}
