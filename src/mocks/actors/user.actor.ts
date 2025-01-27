import { createActor } from 'xstate';
import userMachine from '@/mocks/machines/userMachine';

export default createActor(userMachine);
