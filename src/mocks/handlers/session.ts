import { http, HttpResponse } from 'msw';
import userActor from '@/mocks/actors/user.actor';

export const stateChangeHandler = http.post(
  '*/users/{user_id}/sessions/{session_id}',
  ({ request }) => {
    const searchParams = new URL(request.url).searchParams;
    const operation = searchParams.get('operation');
    if (!operation) {
      throw new HttpResponse(null, { status: 400 });
    }
    userActor.send({ type: camalise(operation), reason: searchParams.get('reason') });
    return HttpResponse.text();
  },
);

export const deactivateHandler = http.delete(
  '*/users/{user_id}/sessions/{session_id}',
  () => new HttpResponse(null, { status: 204 }),
);

const camalise = (str: string) =>
  str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
