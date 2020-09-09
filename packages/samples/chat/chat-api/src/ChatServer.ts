import { Event } from 'laconic-js';
import { thresholdFn, thresholdManifest } from '@thresholds/core';
import { HttpServerOptions } from '@thresholds-transports/http';
import { v4 as uuidv4 } from 'uuid';
import { ChatDb } from './mock-dal';
import { params } from 'express/lib/request';
import { Chat, ChatManifest, Message } from './types';

@thresholdManifest({
    transport: 'http',
    options: {
        route: '/manifest',
        method: 'GET'
    }
})
export class ChatServer {
    private chatSubscriptions: { [chatId:string]: Event<[Message[]]> } = {}

    constructor(private dal: ChatDb) {
    }

    @thresholdFn({
        transport: 'http',
        options: {
            route: '/chats',
            method: 'GET'
        }
    })
    public getChats() { 
        return Object.values(this.dal.chats).map(chat => ({
            chatId: chat.chatId,
            displayName: chat.displayName,
            userIds: chat.userIds
        }));
    }

    @thresholdFn({
        transport: 'http',
        options:{
            route: '/chat',
            method: 'POST'
        }
    })
    public createChat(chat: Pick<Chat,'displayName' | 'userIds'>): ChatManifest {
        const { displayName, userIds } = chat;
        const chatId = uuidv4();
        const newChat = {
            chatId, 
            userIds,
            messageIds: [],
            displayName
        }
        this.dal.chats[chatId] = newChat;
        return {
            chatId,
            users: newChat.userIds.map(userId => this.dal.users[userId]),
            messages: newChat.messageIds.map(messageId => this.dal.messages[messageId]),
            displayName
        }
    }

    @thresholdFn({
        transport: 'http',
        options: {
            route: '/chat/:chatId/messages',
            method: 'POST',
            paramMapper: (params: { chatId: string }, body: any[]) => [
                params.chatId,
                ...body
            ]
        }
    })
    public addMessage(chatId: string, message: Pick<Message, 'userId' | 'body'>) {
        const { body, userId } = message;
        const messageId = uuidv4();
        const newMessage = {
            messageId,
            body,
            timeStamp: Date.now(),
            userId
        }
        this.dal.messages[newMessage.messageId] = newMessage;
        this.dal.chats[chatId].messageIds.push(newMessage.messageId);
    }

    @thresholdFn<HttpServerOptions>({
        transport: 'http',
        options: {
            route: '/chats/:chatId/join',
            method: 'POST',
            paramMapper: ((params: { chatId: string }, body?: any[]) => [ params.chatId, ...body || [] ])
        }
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
            users: targetChat.userIds.map(userId => this.dal.users[userId]),
            messages: targetChat.messageIds.map(messageId => this.dal.messages[messageId])
        }
    }

    private getChatEvent(chatId: string) {
        return this.chatSubscriptions[chatId] = this.chatSubscriptions[chatId] || new Event<[ Message[] ]>();
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