import ChatList from "./chat-list";
import { ChatCreator } from "./chat-creator";
import { ChatApi, ChatList as ChatListType } from "./chat-api";
import * as React from 'react';
import { UserManager } from "./user-manager";
import { ChatBox } from "./chat-box";

export const ChatDemo = (chatApi: ChatApi) => {
    const [ chatList, setChatList ] = React.useState<ChatListType>([]);
    const [ userId, setUserId ] = React.useState<string>();
    const [ openChats, setOpenChats ] = React.useState<ChatManifest[]>([]);

    const loadChats = async () => setChatList(await chatApi.getChats());

    React.useEffect(() => {
        loadChats();
    }, [ userId ]);

    const createChat = async displayName => {
        await chatApi.createChat({
            displayName,
            userIds: [ userId ]
        });
         await loadChats();
    }
  
    const onChatOpened = async chatId => {
      const chat = await chatApi.joinChat(chatId, userId);
      setOpenChats([ ...openChats, chat ]);
    }

    return (
        <>
            <h2>User Details</h2>
            <UserManager
                onIdChanged={setUserId}
            />
            <h2>Chat List</h2>
            <ChatList
                chats={chatList}
                onChatOpened={chatId => onChatOpened(chatId)}
            />
            <h3>Chat Creator</h3>
            {
                userId &&
                <ChatCreator
                    onCreateChat={createChat}
                />
            }
            <h3>Open Chats</h3>
            {
                openChats.map(chat => (
                    <ChatBox
                        key={chat.chatId}
                        chat={chat}
                        onSubmitMessage={(body) => chatApi.addMessage(
                            chat.chatId,
                            {
                                body,
                                userId,
                            }
                        )}
                    />
                ))
            }
        </>
    );
}