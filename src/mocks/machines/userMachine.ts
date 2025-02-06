import { assign, emit, setup } from 'xstate';
import voiceResourceMachine from '@/mocks/machines/voiceResourceMachine';

const userMachine = setup({
  actors: {
    voiceResourceMachine,
  },
  types: {
    context: {} as {
      authConfig: {
        hotDeskEnabled: boolean;
        maxLocationCount: number;
        locations: {
          id: string;
          externalId: string;
          label: string;
          isDefault: boolean;
          userEditable: boolean;
          address: {
            country: string;
            city: string;
            state: string;
            postal: string;
            streetName: string;
            streetNumber: string;
          };
          locationDetail: { type: string; value: string };
        }[];
        features: {
          type: string;
          enabled: boolean;
          releaseDisabled: boolean;
          configuration:
            | { maxLocationCount: number }
            | {
                fqdn: string;
                port: string;
              }
            | {
                provider: string;
                providerDomain: string;
                inboundDomain: string;
                outboundDomain: string;
                preferredMediaLocation: string;
              };
        }[];
      };
      activationConfig: {
        layout?: {
          id: string;
          preferences: { group: string; key: string; value: string }[];
        };
        groups: string[];
        reasonCodes: { id: string; code: string; displayName: string }[];
        emailConfiguration: {
          signaturePreferences: { group: string; key: string; value: string }[];
          draftAutoSaveInterval: number;
          interimResponseEnabled: boolean;
        };
        messagingConfiguration: {
          emojisEnabled: boolean;
          locationsEnabled: boolean;
          audioEnabled: boolean;
          videoEnabled: boolean;
        };
        userPreferences: { group: string; key: string; value: string }[];
        logUploadLocation?: string;
        logUploadEnabled?: boolean;
        logDownloadEnabled?: boolean;
        logPrivacyEnabled?: boolean;
        welcomePage?: string;
        observeIndicatorEnabled?: boolean;
        customerProviderAPIKey?: boolean;
        onlineHelpUrl?: string;
        startWorkState?: string;
        salesforceConfiguration?: Map<string, string>;
        screenpopConfiguration?: Map<string, string>;
        genericChannelFriendlyName?: string;
        genericChannelIcon?: string;
      };
      userDetails: {
        userId: string;
        role: 'AGENT' | 'SUPERVISOR';
        displayName: string;
        firstName: string;
        lastName: string;
      };
      userSession: {
        capabilities: {
          canDeactivate: boolean;
          canLogin: boolean;
          canLogout: boolean;
          canSetNotReady: boolean;
          canSetReady: boolean;
        };
        created: string;
        lastStateChangeTime: string;
        lastUpdatedTime: string;
        previousState: string;
        reasonCode: string;
        stateReason: string;
      };
    },
  },
  actions: {
    setActivated: assign({
      userSession: ({ context }) => ({
        ...context.userSession,
        capabilities: {
          ...context.userSession.capabilities,
          canDeactivate: true,
          canLogin: true,
          canLogout: false,
          canSetNotReady: false,
          canSetReady: false,
        },
      }),
    }),
    setReady: assign({
      userSession: ({ context }) => ({
        ...context.userSession,
        capabilities: {
          ...context.userSession.capabilities,
          canDeactivate: false,
          canLogin: false,
          canLogout: true,
          canSetNotReady: true,
          canSetReady: false,
        },
      }),
    }),
    setNotReady: assign({
      userSession: ({ context }) => ({
        ...context.userSession,
        capabilities: {
          ...context.userSession.capabilities,
          canDeactivate: false,
          canLogin: false,
          canLogout: true,
          canSetNotReady: false,
          canSetReady: true,
        },
      }),
    }),
    setPreviousState: assign({
      userSession: ({ context, self }) => ({
        ...context.userSession,
        previousState: self.getSnapshot()?.value.toString() || context.userSession.previousState,
      }),
    }),
    emitEvent: emit(({ event }) => event),
  },
}).createMachine({
  id: 'userMachine',
  context: () => ({
    authConfig: {
      hotDeskEnabled: false,
      maxLocationCount: 1,
      locations: [],
      features: [],
    },
    activationConfig: {
      layout: undefined,
      groups: [],
      reasonCodes: [],
      emailConfiguration: {
        signaturePreferences: [],
        draftAutoSaveInterval: 0,
        interimResponseEnabled: false,
      },
      messagingConfiguration: {
        emojisEnabled: false,
        locationsEnabled: false,
        audioEnabled: false,
        videoEnabled: false,
      },
      userPreferences: [],
      logUploadLocation: undefined,
      logUploadEnabled: false,
      logDownloadEnabled: false,
      logPrivacyEnabled: false,
      welcomePage: undefined,
      observeIndicatorEnabled: false,
      customerProviderAPIKey: false,
      onlineHelpUrl: undefined,
      startWorkState: 'READY',
      salesforceConfiguration: new Map(),
      screenpopConfiguration: new Map(),
      genericChannelFriendlyName: undefined,
      genericChannelIcon: undefined,
    },
    userDetails: {
      userId: 'agent72',
      role: 'AGENT',
      displayName: 'agent72',
      firstName: 'agent72',
      lastName: 'agent72',
    },
    userSession: {
      capabilities: {
        canDeactivate: false,
        canLogin: false,
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
  initial: 'SETUP',
  always: {
    guard: ({ event }) => !event.type.includes('xstate'),
    actions: 'emitEvent',
  },
  states: {
    SETUP: {
      on: {
        setupFinished: {
          target: 'UNKNOWN',
        },
      },
    },
    UNKNOWN: {
      on: {
        activate: {
          target: 'ACTIVATED',
        },
      },
    },
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
          target: 'ACTIVATED',
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
          target: 'ACTIVATED',
        },
      },
    },
    DEACTIVATED: {
      type: 'final',
    },
  },
});

export default userMachine;
