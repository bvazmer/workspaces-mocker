import { createMachine, sendTo } from 'xstate';
import userMachine from '@/mocks/machines/userMachine';

export default createMachine({
  context: ({ spawn }) => ({
    userRef: spawn(userMachine, { id: 'user' }),
    client: {
      clientSession: 'e9c4a97a-26f4-4c72-9d1c-34ad08c8d01c',
      serverVersion: 'v1',
      heartbeatPadding: 'X',
      clientHeartbeatInterval: 30000,
      serverHeartbeatTimeout: 90000,
      reconnectInterval: 5000,
      reconnectOnServerTimeout: true,
      maxReconnectAttempts: 60,
      autoResync: true,
      agentJourney: false,
    },
  }),
  initial: 'DEACTIVATED',
  states: {
    DEACTIVATED: {
      on: {
        activate: {
          target: 'ACTIVATED',
          actions: ({ event, context }) => sendTo(context.userRef, { type: event.type }),
        },
      },
    },
    ACTIVATED: {
      on: {
        deactivate: {
          target: 'DEACTIVATED',
          actions: ({ event, context }) => sendTo(context.userRef, { type: event.type }),
        },
      },
    },
  },
  on: {
    '*': {
      actions: ({ event, context }) => sendTo(context.userRef, event),
    },
  },
});
