import { http, HttpResponse } from 'msw';
import userActor from '@/mocks/actors/user.actor';
import voiceResourceActor from '@/mocks/actors/voice-resource.actor.ts';

export default http.get(
  '*/accounts/:accountId/authentication-users/:userLoginId/authentication-configurations',
  () => {
    const { context: userContext } = userActor.getSnapshot();
    const { userDetails, authConfig } = userContext;
    const { context: voiceContext } = voiceResourceActor.getSnapshot();

    return HttpResponse.json({
      user: userDetails,
      voiceResource: voiceContext,
      ...authConfig,
    });
  },
);
