interface User {
    displayName: string;
    id: string;
}

interface Message {
    userId: string;
    messageId: string;
    body: string;
    timeStamp: number;
}

interface Chat {
    userIds: string[];
    chatId: string;
    displayName: string;
    messageIds: string[];
}


interface ChatManifest {
    users: User[];
    chatId: string;
    displayName: string;
    messages: Message[];
}

