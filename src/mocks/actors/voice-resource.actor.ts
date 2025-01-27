import { createActor } from 'xstate';
import voiceResourceMachine from '@/mocks/machines/voiceResourceMachine';

export default createActor(voiceResourceMachine);
