export type Role = 'user' | 'assistant';

export interface Source {
  title: string;
  url: string;
}

export interface Message {
  role: Role;
  content: string;
  sources?: Source[];
}

export interface Chat {
  chatId: string;
  messages: Message[];
}

export interface CreateChatResponse {
  chatId: string;
}

export interface SendMessageResponse {
  chatId: string;
  messages: Message[];
  sources: Source[];
}
