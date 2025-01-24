import { http, HttpResponse } from 'msw';
import voiceResourceActor from '../actors/voice-resource.actor';

export default http.post('*/users/*/sessions', () =>
  HttpResponse.json({
    profileId: voiceResourceActor.getSnapshot().context.providerId,
  }),
);
