import { Event } from "@threshold-libs/event/event";


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