import { randomUUID } from "node:crypto";

import type { Chat } from "../models/chat.model.js";
import type { Message, MessageRole } from "../models/message.model.js";
import { ChatNotFoundError } from "../errors/chat-not-found.error.js";

export class ConversationService {
    private chats = new Map<string, Chat>();

    createChat(): Chat {
        const id = randomUUID();
        const now = new Date();

        const newChat: Chat = {
            id,
            createdAt: now,
            updatedAt: now,
            messages: []
        };

        this.chats.set(id, newChat);

        return newChat;
    }

    getChat(chatId: string): Chat {
    const chat = this.chats.get(chatId);
    
    if (!chat) {
      throw new ChatNotFoundError(chatId);
    }
    
    return chat;
  }

  deleteChat(chatId: string): void {
    // We can reuse getChat to verify it exists and throw the error if it doesn't!
    const chat = this.getChat(chatId); 
    this.chats.delete(chat.id);
  }

  // The helper method suggested to keep message creation logic out of the controller
  private createMessage(role: MessageRole, content: string): Message {
    return {
      id: randomUUID(),
      role,
      content,
      createdAt: new Date()
    };
  }

  // Updated to take role and content directly, utilizing the helper
  addMessage(chatId: string, role: MessageRole, content: string): Chat {
    const chat = this.getChat(chatId); // Throws if the chat doesn't exist
    
    const newMessage = this.createMessage(role, content);
    chat.messages.push(newMessage);
    chat.updatedAt = new Date(); // Don't forget to bump the updated timestamp!
    
    return chat;
  }


}