import { ws } from 'msw';
import userActor from '@/mocks/actors/user.actor';
import { v4 as uuidv4 } from 'uuid';

const socketHandler = ws.link('ws://*/broadcast').addEventListener('connection', ({ client }) => {
  const handleUserSessionUpdate = () => {
    const { context: userContext, value: userState } = userActor.getSnapshot();
    const { userSession } = userContext;

    client.send(
      JSON.stringify({
        id: uuidv4(),
        type: 'USER',
        notificationChangeType: 'UPDATE',
        newValue: {
          ...userSession,
          currentState: userState,
        },
      }),
    );
  };

  userActor.on('*', ({ type }) => {
    switch (type) {
      case 'activate':
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
    const { type } = JSON.parse(event.data.toString());
    if (type === 'authorize') {
      client.send(
        JSON.stringify({
          clientSessionId: '32826e5a-a71e-489d-8623-79fbc3cefa27',
          serverVersion: 'v1',
          heartbeatPadding: 'X',
          clientHeartbeatInterval: 10000,
          serverHeartbeatTimeout: 90000,
          reconnectInterval: 5000,
          reconnectOnServerTimeout: true,
          maxReconnectAttempts: 60,
          autoResync: true,
          agentJourney: false,
        }),
      );
      // send initial user state
      handleUserSessionUpdate();
    }
  });
});

export default socketHandler;
