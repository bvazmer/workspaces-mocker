import { ws } from 'msw';
import userActor from '@/mocks/actors/user.actor';
import { v4 as uuidv4 } from 'uuid';

const socketHandler = ws.link('ws://*/broadcast').addEventListener('connection', ({ client }) => {
  const handleUserSessionUpdate = () => {
    const { context: userContext, value: userState } = userActor.getSnapshot();
    const { capabilities, userSession } = userContext;

    client.send(
      JSON.stringify({
        id: uuidv4(),
        type: 'USER',
        notificationChangeType: 'UPDATE',
        newValue: {
          ...userSession,
          capabilities,
          currentState: userState,
        },
      }),
    );
  };

  userActor.start();

  userActor.on('*', ({ type }) => {
    switch (type) {
      case 'login':
      case 'logout':
      case 'ready':
      case 'notReady':
        handleUserSessionUpdate();
        break;
    }
  });

  client.addEventListener('message', (event) => {
    if (event.type !== 'message' || event.data === 'X') {
      client.send('X');
      return;
    }
    const data = JSON.parse(event.data.toString());
    if (data.type === 'authorize') {
      // send initial user state
      handleUserSessionUpdate();
    }
  });
});

export default socketHandler;
