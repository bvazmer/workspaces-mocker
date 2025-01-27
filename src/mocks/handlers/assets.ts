import { http, HttpResponse } from 'msw';

const imageHandler = http.get(
  'http://localhost:4200/uwf-workspaces/assets/*.svg',
  async ({ request }) => {
    const filePath = request.url.split('/assets/')[1];
    const buffer = await fetch(`http://localhost:4002/uwf-workspaces/assets/${filePath}`).then(
      (response) => response.arrayBuffer(),
    );
    return HttpResponse.arrayBuffer(buffer, {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  },
);

const videoHandler = http.get(
  'http://localhost:4200/uwf-workspaces/assets/*.mp4',
  async ({ request }) => {
    const filePath = request.url.split('/assets/')[1];
    const videoResponse = await fetch(`http://localhost:4002/uwf-workspaces/assets/${filePath}`);
    const videoStream = videoResponse.body;
    const latencyStream = new TransformStream({
      start() {},
      async transform(chunk, controller) {
        controller.enqueue(chunk);
      },
    });
    if (!videoStream) {
      return new HttpResponse(null, { status: 404 });
    }
    return new HttpResponse(videoStream.pipeThrough(latencyStream), videoResponse);
  },
);

export { imageHandler, videoHandler };
