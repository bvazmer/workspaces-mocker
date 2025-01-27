import { http, HttpResponse } from 'msw';

export default http.get('*/health/status', () => HttpResponse.json({ status: 'UP' }));
