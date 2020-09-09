export interface User {
  displayName: string;
  id: string;
}

export interface Message {
  userId: string;
  messageId: string;
  body: string;
  timeStamp: number;
}

export interface Chat {
  userIds: string[];
  chatId: string;
  displayName: string;
  messageIds: string[];
}


export interface ChatManifest {
  users: User[];
  chatId: string;
  displayName: string;
  messages: Message[];
}

