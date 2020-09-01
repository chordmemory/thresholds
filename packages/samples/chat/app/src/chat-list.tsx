import * as React from 'react';
import { ChatList } from "./chat-api";

interface Props {
  chats: ChatList,
  onChatOpened: (chatId: string) => void;
}

export default (props: Props) => {
  const { chats, onChatOpened } = props;
  return (
      <>
        {props.chats.map((chat, index) => (
          <div key={index}>
            {chat.displayName}  
            <button type="button" onClick={() => onChatOpened(chat.chatId)}>Open Chat</button>
          </div>
        ))}
      </>
  );
}