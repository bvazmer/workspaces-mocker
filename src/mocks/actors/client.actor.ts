import { createActor } from 'xstate';
import clientMachine from '@/mocks/machines/clientMachine';

export default createActor(clientMachine);
