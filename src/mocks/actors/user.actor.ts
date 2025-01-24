import { createActor } from 'xstate';
import userMachine from '../machines/userMachine';

export default createActor(userMachine);
