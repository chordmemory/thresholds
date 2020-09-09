import * as React from 'react';
import { ChatManifest, User } from './types';

interface Props {
    chat: ChatManifest,
    onSubmitMessage: (message: string) => void;
}

export const ChatBox = (props: Props) => {
    const { onSubmitMessage, chat } = props;
    const [ currentMessage, setCurrentMessage ] = React.useState('');

    const userMap = chat.users.reduce<{ [userId: string]: User }>((userMap, user) => ({
        ...userMap,
        [user.id]: user
    }), {});
    return (
        <>
            <div>
                {chat.messages.map(message => (
                    <div>
                        <span>{userMap[message.userId].displayName}: </span>
                        {message.body}
                    </div>
                ))}
            </div>
            <form>
                <label>
                    Enter Message
                    <input type="text" name="id" value={currentMessage} onChange={event => setCurrentMessage(event.target.value)} />
                </label>
                <input type="button" value="Submit" onClick={() => onSubmitMessage(currentMessage) }/>
            </form>
        </>
    )
}