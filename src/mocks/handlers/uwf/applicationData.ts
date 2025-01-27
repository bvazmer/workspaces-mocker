import { http, HttpResponse } from 'msw';

export default http.get('*/api/uwf-query-service/applications/workspaces/applicationdata', () => {
  // ...and respond to them using this JSON response.
  return HttpResponse.json({
    widgets: [
      {
        id: 'workspaces',
        element: 'workspaces',
        resources: {
          js: 'http://localhost:4002/uwf-workspaces/workspaces-0.0.0.js',
          css: 'http://localhost:4002/uwf-workspaces/workspaces-0.0.0.css',
        },
        metadata: {
          logLevel: 'trace',
          sdkLogLevel: 'trace',
          kazoo: {
            disableDebugMode: false,
          },
          defaultLogRange: 10,
        },
        version: '4.207.14',
      },
    ],
    formations: [
      {
        id: 'workspaces',
        columns: 'minmax(min-content, max-content) 1fr minmax(min-content, max-content)',
        rows: 'minmax(min-content, max-content) minmax(min-content, max-content) minmax(min-content, max-content) 1fr minmax(min-content, max-content)',
        slots: [
          {
            element: 'ws-topbar',
            column: 'span 3',
            row: '1 / 2',
          },
          {
            element: 'ws-work-area',
            column: '1 / 2',
            row: '2 / 5',
          },
          {
            element: 'ws-interaction-panel',
            column: '2 / 3',
            row: '2 / 3',
          },
          {
            element: 'uwf-context-canvas',
            column: '2 / 3',
            row: '3 / 5',
          },
          {
            element: 'ws-auxiliary-panel',
            column: '3 / 4',
            row: '2 / 5',
          },
        ],
      },
      {
        id: 'workspaces-activate',
        columns: 'auto 600px auto',
        rows: '25% 50% 25%',
        slots: [
          {
            element: 'ws-activate-area',
            column: '2',
            row: '2',
          },
        ],
      },
      {
        id: 'workspaces-failed-activation',
        columns: 'auto 600px auto',
        slots: [
          {
            element: 'ws-failed-activation',
            column: '2',
            row: '2',
          },
        ],
      },
      {
        id: 'workspaces-deactivate-sessions',
        columns: 'auto 600px auto',
        rows: '25% 50% 25%',
        slots: [
          {
            element: 'ws-deactivate-sessions',
            column: '2',
            row: '2',
          },
        ],
      },
    ],
  });
});
