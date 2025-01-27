import { assign, setup } from 'xstate';
import voiceResourceMachine from '@/mocks/machines/voiceResourceMachine';

const userMachine = setup({
  actors: {
    voiceResourceMachine,
  },
  actions: {
    setActivated: assign({
      capabilities: ({ context }) => ({
        ...context.capabilities,
        canDeactivate: true,
        canLogin: true,
        canLogout: false,
        canSetNotReady: false,
        canSetReady: false,
      }),
    }),
    setReady: assign({
      capabilities: ({ context }) => ({
        ...context.capabilities,
        canDeactivate: false,
        canLogin: false,
        canLogout: true,
        canSetNotReady: true,
        canSetReady: false,
      }),
    }),
    setNotReady: assign({
      capabilities: ({ context }) => ({
        ...context.capabilities,
        canDeactivate: false,
        canLogin: false,
        canLogout: true,
        canSetNotReady: true,
        canSetReady: true,
      }),
    }),
    setPreviousState: assign({
      userSession: ({ context, self }) => ({
        ...context.userSession,
        previousState: self.getSnapshot()?.value || context.userSession.previousState,
      }),
    }),
  },
}).createMachine({
  id: 'userMachine',
  entry: [
    assign({
      voiceMachineRef: ({ spawn }) => spawn(voiceResourceMachine, { syncSnapshot: true }),
    }),
  ],
  context: () => ({
    userDetails: {
      id: 'agent72',
      displayName: 'agent72',
      userHandle: 'agent72',
      firstName: 'agent72',
      lastName: 'agent72',
    },
    userSession: {
      capabilities: {
        canDeactivate: true,
        canLogin: true,
        canLogout: false,
        canSetNotReady: false,
        canSetReady: false,
      },
      created: new Date().toISOString(),
      lastStateChangeTime: new Date().toISOString(),
      lastUpdatedTime: new Date().toISOString(),
      previousState: 'SESSION_DISCONNECT',
      reasonCode: '',
      stateReason: 'DEFAULT',
    },
  }),
  initial: 'LOGGED_OUT',
  states: {
    ACTIVATED: {
      entry: 'setActivated',
      on: {
        login: {
          target: 'READY',
        },
      },
    },
    READY: {
      entry: 'setReady',
      on: {
        notReady: {
          target: 'NOT_READY',
        },
        logout: {
          target: 'LOGGED_OUT',
        },
      },
    },
    NOT_READY: {
      entry: 'setNotReady',
      on: {
        ready: {
          target: 'READY',
        },
        logout: {
          target: 'LOGGED_OUT',
        },
      },
    },
    DEACTIVATED: {
      type: 'final',
    },
  },
});

export default userMachine;
