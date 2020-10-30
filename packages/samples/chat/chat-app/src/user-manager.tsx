import * as React from 'react';

export const UserManager = (props: {
  onIdChanged: (userId: string) => void;
}) => {
  const { onIdChanged } = props;
  const [userId, setUserId] = React.useState<string>();
  return (
    <>
      <form>
        <label>
          Id:
          <input
            type="text"
            name="id"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
          />
        </label>
        <input
          type="button"
          value="Submit"
          onClick={() => userId && onIdChanged(userId)}
        />
      </form>
    </>
  );
};
