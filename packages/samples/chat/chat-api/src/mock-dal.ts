import { Chat, Message, User } from './types';

export class ChatDb {
  public chats: { [chatId: string]: Chat } = {};
  public users: { [userId: string]: User } = {
    '00001': {
      displayName: 'Dave',
      id: '00001'
    }
  };
  public messages: { [messagId: string]: Message } = {};
}
