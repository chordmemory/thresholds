import { expose, threshold } from '@thresholds/core';
import { v4 as uuidv4 } from 'uuid';
import { ChatDb } from './mock-dal';
import { Chat, ChatManifest, Message } from './types';
import { HttpExposeOptions } from '../../../../exposers/http/dist/types';

@threshold('http', { route: '/manifest', method: 'get' })
export class ChatServer {
  constructor(private dal: ChatDb) {}

  @expose<HttpExposeOptions>('http', { route: '/chats', method: 'GET' })
  public getChats() {
    return Object.values(this.dal.chats).map((chat) => ({
      chatId: chat.chatId,
      displayName: chat.displayName,
      userIds: chat.userIds
    }));
  }

  @expose<HttpExposeOptions>('http', { route: '/chat', method: 'POST' })
  public createChat(chat: Pick<Chat, 'displayName' | 'userIds'>): ChatManifest {
    const { displayName, userIds } = chat;
    const chatId = uuidv4();
    const newChat = {
      chatId,
      userIds,
      messageIds: [],
      displayName
    };
    this.dal.chats[chatId] = newChat;
    return {
      chatId,
      users: newChat.userIds.map((userId) => this.dal.users[userId]),
      messages: newChat.messageIds.map(
        (messageId) => this.dal.messages[messageId]
      ),
      displayName
    };
  }

  @expose<HttpExposeOptions>('http', {
    route: '/chat/:chatId/messages',
    method: 'POST',
    paramMapper: (params: { chatId: string }, body?: any[]) => [
      params.chatId,
      ...(body || [])
    ]
  })
  public addMessage(chatId: string, message: Pick<Message, 'userId' | 'body'>) {
    const { body, userId } = message;
    const messageId = uuidv4();
    const newMessage = {
      messageId,
      body,
      timeStamp: Date.now(),
      userId
    };
    this.dal.messages[newMessage.messageId] = newMessage;
    this.dal.chats[chatId].messageIds.push(newMessage.messageId);
  }

  @expose<HttpExposeOptions>('http', {
    route: '/chats/:chatId/join',
    method: 'POST',
    paramMapper: (params: { chatId: string }, body?: any[]) => [
      params.chatId,
      ...(body || [])
    ]
  })
  public joinChat(chatId: string, userId: string): ChatManifest {
    const targetChat = this.dal.chats[chatId];
    if (!this.dal.users[userId]) {
      throw new Error('user not in user list');
    }
    if (!targetChat.userIds.includes(userId)) {
      targetChat.userIds.push(userId);
    }
    return {
      displayName: targetChat.displayName,
      chatId: targetChat.chatId,
      users: targetChat.userIds.map((userId) => this.dal.users[userId]),
      messages: targetChat.messageIds.map(
        (messageId) => this.dal.messages[messageId]
      )
    };
  }

  // @threshold({
  //     transport: new WebSocket({
  //         port: 3030,`
  //         route: '/chats/:chatId'
  //     })
  // })
  // public subscribeToMessages(
  //     @stream() streamHandler: StreamHandler<(messages: Message[]) => void, () => void >,
  //     chatId: string
  // ) {
  //     const event = this.getChatEvent(chatId);
  //     event.attach(streamHandler.next);
  // }
}

// interface StreamHandler<N extends (...args: any[]) => void,C extends (...args: any[]) => void> {
//     next: N,
//     complete: C,
//     error: (error: Error) => void;
// }
