import * as React from 'react';
import { ChatList as iChatList } from './chat-api';

interface Props {
  chats: iChatList;
  onChatOpened: (chatId: string) => void;
}

export const ChatList = (props: Props) => {
  const { onChatOpened } = props;
  return (
    <>
      {props.chats.map((chat, index) => (
        <div key={index}>
          {chat.displayName}
          <button type="button" onClick={() => onChatOpened(chat.chatId)}>
            Open Chat
          </button>
        </div>
      ))}
    </>
  );
};
