import { http, HttpResponse } from 'msw';
import userActor from '@/mocks/actors/user.actor';

export default http.get(
  '*/accounts/:accountId/authentication-users/:userLoginId/activation-configurations',
  () => {
    const { context } = userActor.getSnapshot();
    return HttpResponse.json(context.activationConfig);
  },
);
