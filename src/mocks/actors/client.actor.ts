import { createActor } from 'xstate';
import clientMachine from '../machines/clientMachine';

export default createActor(clientMachine);
