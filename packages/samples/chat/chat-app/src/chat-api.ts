import { Chat, ChatManifest, Message } from './types';

export type ChatList = { chatId: string; displayName: string; userIds: string[] }[]

export interface ChatApi {
    getChats(): Promise<ChatList>;
    createChat(chat: Pick<Chat, 'displayName' | 'userIds'>): Promise<ChatManifest>;
    addMessage(chatId: string, message: Pick<Message, 'userId' | 'body'>): Promise<void>;
    joinChat(chatId: string, userId: string): ChatManifest;
}
