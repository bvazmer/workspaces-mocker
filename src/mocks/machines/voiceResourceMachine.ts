import { setup } from 'xstate';

const voiceResourceMachine = setup({
  types: {
    context: {} as {
      id: 'VOICE';
      address: string;
      displayName: string;
      lineAppearanceCount?: number;
      mailboxNumber?: string;
      trunkAccessCode?: string;
    },
  },
}).createMachine({
  id: 'voiceResourceMachine',
  context: () => ({
    id: 'VOICE',
    address: '600072',
    displayName: 'c7501d95-78f8-429a-b341-c10478e5c2e1 - 600072',
  }),
});

export default voiceResourceMachine;
