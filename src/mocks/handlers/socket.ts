import { ws } from 'msw';
import userActor from '../actors/user.actor';
import clientActor from '../actors/client.actor';

const getDataFromStore = () => {
  const { client: clientData } = clientActor.getSnapshot().context;
  const { context: userContext, value: userState } = userActor.getSnapshot();
  const { capabilities, userDetails, userSession } = userContext;
  const { context: voiceResourceContext, value: voiceResourceState } = userActor
    .getSnapshot()
    .context.voiceMachineRef.getSnapshot();

  return {
    clientData,
    userState,
    capabilities,
    userDetails,
    userSession,
    voiceResourceContext,
    voiceResourceState,
  };
};

const socketHandler = ws.link('ws://*/broadcast').addEventListener('connection', ({ client }) => {
  const handleUserSessionUpdate = () => {
    const {
      clientData,
      userState,
      capabilities,
      userDetails,
      userSession,
      voiceResourceContext,
      voiceResourceState,
    } = getDataFromStore();

    client.send(
      JSON.stringify({
        id: '51d65043-188a-461c-9891-78627a7de03e',
        parentId: '',
        notificationType: 'USER_STATE',
        clientSessionId: clientData.clientSession,
        notificationChangeType: 'UPDATE',
        updatedProperty: 'USER_SESSION',
        newValue: {
          ...userSession,
          capabilities,
          currentState: userState,
          id: '7f0a9ef8-0ba0-46ba-a660-e257d01001f0',
          originStates: {
            ['AXP']: {
              reasonCode: userSession.reasonCode,
              state: userState,
              stateReason: userSession.stateReason,
              capabilities: capabilities,
              originCapabilities: capabilities,
              lastStateChangeTime: userSession.lastStateChangeTime,
            },
          },
          resourceStates: {
            ['VOICE']: {
              state: voiceResourceState,
              ...voiceResourceContext,
            },
          },
          userDisplayName: userDetails.displayName,
          userHandle: userDetails.userHandle,
        },
      }),
    );
  };

  const handleAuthorize = () => {
    const {
      clientData,
      userState,
      capabilities,
      userDetails,
      userSession,
      voiceResourceContext,
      voiceResourceState,
    } = getDataFromStore();

    client.send(JSON.stringify(clientData));

    client.send(
      JSON.stringify({
        id: '6f777364-c9e4-4720-9656-46b95b3ba4d3',
        parentId: '',
        clientSessionId: clientData.clientSession,
        notificationType: 'ACTIVATE',
        notificationChangeType: 'NEW',
        updatedProperty: 'ACTIVATION_DETAILS',
        newValue: {
          mailboxNumber: '',
          profileId: clientData.profileId,
          reason: 'DEFAULT',
          reasonCodes: [],
          templateGroups: [],
          trunkAccessCode: '',
          userDetails,
          userSession: {
            ...userSession,
            capabilities,
            currentState: userState,
            resourceStates: {},
            originStates: {
              ['AXP']: {
                reasonCode: userSession.reasonCode,
                state: userState,
                stateReason: userSession.stateReason,
                capabilities: capabilities,
                originCapabilities: capabilities,
                lastStateChangeTime: userSession.lastStateChangeTime,
              },
            },
          },
        },
      }),
    );

    client.send(
      JSON.stringify({
        id: '11e48b0f-e402-4038-b744-566f4f97408e',
        parentId: '',
        notificationType: 'ACQUIRE',
        clientSessionId: clientData.clientSession,
        notificationChangeType: 'NEW',
        updatedProperty: 'RESOURCE_SESSION',
        newValue: {
          id: '4c9974f7-cdbd-4e2d-b026-21bc1472e481',
          providerId: voiceResourceContext.providerId,
          channelType: voiceResourceContext.channelType,
          resourceAddress: voiceResourceContext.resourceAddress,
          resourceState: voiceResourceState,
          loginAccountId: userDetails.id,
          reasonCodes: [
            {
              id: '65d31e72-b240-4141-85c6-0a1e0835d3a8',
              code: '100',
              friendlyName: 'Union Break',
              type: 'NOT_READY',
              channels: ['VOICE'],
              state: 'ACTIVE',
            },
            {
              id: 'ee664cd4-682e-457d-b1ac-73b3504e686f',
              code: '101',
              friendlyName: 'Union Break',
              type: 'NOT_READY',
              channels: ['VOICE'],
              state: 'ACTIVE',
            },
            {
              id: 'af0457b2-57ac-42c6-a21b-c5bc400cdf6d',
              code: '102',
              friendlyName: 'Union Break',
              type: 'NOT_READY',
              channels: ['VOICE'],
              state: 'ACTIVE',
            },
            {
              id: '715f310d-7cc3-4b88-8946-b297048a2c3f',
              code: '998',
              friendlyName: 'Supervisor Code',
              type: 'SUPERVISOR',
              channels: ['VOICE'],
              state: 'ACTIVE',
            },
          ],
          origin: userSession.origin,
        },
      }),
    );

    handleUserSessionUpdate();

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
  };

  client.addEventListener('message', (event) => {
    if (event.type !== 'message' || event.data === 'X') {
      client.send('X');
      return;
    }
    const data = JSON.parse(event.data.toString());
    if (data.type === 'authorize') {
      handleAuthorize();
    }
  });
});

export default socketHandler;
