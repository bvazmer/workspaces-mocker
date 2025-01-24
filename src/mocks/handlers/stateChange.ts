import userActor from '../actors/user.actor';
import { http, HttpResponse } from 'msw';

export default http.post('*/users/*/sessions/*', ({ request }) => {
  const operation = new URL(request.url).searchParams.get('operation');
  let eventName: string | null = '';
  switch (operation) {
    case 'login':
    case 'logout':
      eventName = operation;
      break;
    case 'state':
      eventName = new URL(request.url).searchParams.get('state');
      break;
  }
  if (eventName) {
    userActor.send(new Event(camalise(eventName)));
    return HttpResponse.text();
  }
});

const camalise = (str: string) => {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
};
