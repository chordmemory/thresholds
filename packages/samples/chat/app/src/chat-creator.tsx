import * as React from 'react';

export const ChatCreator = (props: { onCreateChat: (chatName: string) => void }) => {
  const { onCreateChat } = props;
  const [chatName, setChatName] = React.useState('');
  return (
    <form>
      <label>
        Name:
          <input type="text" name="name" value={chatName} onChange={event => setChatName(event.target.value)} />
      </label>
      <input type="button" value="Submit" onClick={() => onCreateChat(chatName) }/>
    </form>
  );
}