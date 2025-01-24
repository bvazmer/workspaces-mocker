import { createActor } from 'xstate';
import voiceResourceMachine from '../machines/voiceResourceMachine';

export default createActor(voiceResourceMachine);
