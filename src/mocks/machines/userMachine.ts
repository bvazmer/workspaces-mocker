import { assign, emit, sendTo, setup } from 'xstate';
import voiceResourceMachine from './voiceResourceMachine';

const userMachine = setup({
  actors: {
    voiceResourceMachine,
  },
  actions: {
    setLoggedOut: assign({
      capabilities: ({ context }) => ({
        ...context.capabilities,
        canLogin: true,
        canLogout: false,
        canMentorVoice: false,
        canMonitorTeamMember: false,
        canSetNotReady: false,
        canSetReady: false,
        canSupervisorLogout: false,
      }),
    }),
    setReady: assign({
      capabilities: ({ context }) => ({
        ...context.capabilities,
        canLogin: false,
        canLogout: true,
        canMentorVoice: true,
        canMonitorTeamMember: true,
        canSetNotReady: true,
        canSetReady: false,
        canSupervisorLogout: true,
        canSupervisorSetNotReady: true,
        canSupervisorSetReady: false,
      }),
    }),
    setNotReady: assign({
      capabilities: ({ context }) => ({
        ...context.capabilities,
        canLogin: false,
        canLogout: true,
        canMentorVoice: true,
        canMonitorTeamMember: true,
        canSetNotReady: true,
        canSetReady: true,
        canSupervisorLogout: true,
        canSupervisorSetNotReady: true,
        canSupervisorSetReady: true,
      }),
    }),
    setPreviousState: assign({
      userSession: ({ context, self }) => ({
        ...context.userSession,
        previousState: self.getSnapshot()?.value || context.userSession.previousState,
      }),
    }),
    sendToVoice: sendTo(
      ({ context }) => context.voiceMachineRef,
      ({ self, event }) => ({ type: event.type, sender: self }),
    ),
    emitEvent: emit(({ event }) => event),
  },
}).createMachine({
  id: 'userMachine',
  entry: [
    assign({
      voiceMachineRef: ({ spawn }) => spawn(voiceResourceMachine, { syncSnapshot: true }),
    }),
  ],
  context: () => ({
    capabilities: {
      canDeactivate: true,
      canLogin: true,
      canLogout: false,
      canMentorChat: false,
      canMentorMessaging: false,
      canMentorSMS: false,
      canMentorVoice: false,
      canMonitorTeamMember: false,
      canSetAfterContactWork: false,
      canSetNotReady: false,
      canSetReady: false,
      canSetWorkMode: false,
      canSupervisorDeactivate: true,
      canSupervisorLogout: false,
      canSupervisorSetNotReady: false,
      canSupervisorSetReady: false,
    },
    userDetails: {
      id: 'agent72',
      displayName: 'agent72',
      userHandle: 'agent72',
      firstName: 'agent72',
      lastName: 'agent72',
    },
    userSession: {
      created: new Date().toISOString(),
      lastOrigin: 'AXP',
      lastStateChangeTime: new Date().toISOString(),
      lastUpdatedTime: new Date().toISOString(),
      origin: 'AXP',
      previousState: 'SESSION_DISCONNECT',
      role: 'AGENT',
      reasonCode: '', //'00104',
      stateReason: 'DEFAULT',
      supervisorUserId: '',
      tenantId: 'PRMEBQ',
      tenantName: '',
    },
  }),
  initial: 'LOGGED_OUT',
  always: {
    guard: ({ event }) => !event.type.includes('xstate'),
    actions: ['sendToVoice', 'emitEvent'],
  },
  states: {
    ['LOGGED_OUT']: {
      entry: 'setLoggedOut',
      on: {
        login: {
          target: 'READY',
        },
      },
    },
    ['READY']: {
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
    ['NOT_READY']: {
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
