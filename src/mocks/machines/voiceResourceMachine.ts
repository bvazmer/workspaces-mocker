import { assign, setup } from 'xstate';

const voiceResourceMachine = setup({
  types: {
    context: {} as {
      id: 'VOICE';
      channelType: string;
      providerId: string;
      resourceAddress: string;
      resourceKey: string;
      displayName: string;
      stateReason: string;
      previousState: string;
      capabilities: {
        canCancelCallForwarding: boolean;
        canDefer: boolean;
        canRetrieveInteractions: boolean;
        canSetCallForwarding: boolean;
        canStartAgentToAgentInteraction: boolean;
        canStartInteraction: boolean;
        canStartSupervisorInteraction: boolean;
        canStartSupervisorToAgentInteraction: boolean;
        canSupervisorRetrieveInteractions: boolean;
      };
    },
  },
  actions: {
    setLoggedIn: assign({
      capabilities: ({ context }) => ({
        ...context.capabilities,
        canCancelCallForwarding: true,
        canSetCallForwarding: true,
      }),
    }),
    setLoggedOut: assign({
      capabilities: ({ context }) => ({
        ...context.capabilities,
        canCancelCallForwarding: false,
        canSetCallForwarding: false,
      }),
    }),
    setPreviousState: assign({
      previousState: ({ context, self }) =>
        (self.getSnapshot()?.value as string) || context.previousState,
    }),
  },
}).createMachine({
  id: 'voiceResourceMachine',
  context: () => ({
    id: 'VOICE',
    channelType: 'VOICE',
    providerId: 'c7501d95-78f8-429a-b341-c10478e5c2e1',
    resourceAddress: '600072',
    resourceKey: '1-c7501d95-78f8-429a-b341-c10478e5c2e1-600072',
    displayName: 'c7501d95-78f8-429a-b341-c10478e5c2e1 - 600072',
    stateReason: 'DEFAULT',
    previousState: 'UNKNOWN',
    capabilities: {
      canCancelCallForwarding: false,
      canDefer: false,
      canRetrieveInteractions: false,
      canSetCallForwarding: false,
      canStartAgentToAgentInteraction: true,
      canStartInteraction: false,
      canStartSupervisorInteraction: true,
      canStartSupervisorToAgentInteraction: true,
      canSupervisorRetrieveInteractions: false,
    },
  }),
  initial: 'LOGGED_OUT',
  states: {
    ['LOGGED_OUT']: {
      entry: 'setLoggedOut',
      exit: 'setPreviousState',
      on: {
        login: {
          target: 'READY',
        },
      },
    },
    ['READY']: {
      entry: 'setLoggedIn',
      exit: 'setPreviousState',
      on: {
        notReady: {
          target: 'NOT_READY',
        },
        logout: {
          target: 'LOGGED_OUT',
        },
      },
    },
    ['NOT_READY']: {
      entry: 'setLoggedIn',
      exit: 'setPreviousState',
      on: {
        ready: {
          target: 'READY',
        },
        logout: {
          target: 'LOGGED_OUT',
        },
      },
    },
  },
});

export default voiceResourceMachine;
